import AVFoundation
import Foundation

// Transcodifica com bitrate explícito — o que o avconvert não permite.
// uso: encode.swift <origem> <destino> <largura> <altura> <kbpsVideo> <kbpsAudio>
let a = CommandLine.arguments
guard a.count == 7 else { fputs("argumentos insuficientes\n", stderr); exit(2) }
let src = URL(fileURLWithPath: a[1]), dst = URL(fileURLWithPath: a[2])
let W = Int(a[3])!, H = Int(a[4])!, vbps = Int(a[5])! * 1000, abps = Int(a[6])! * 1000

try? FileManager.default.removeItem(at: dst)
let asset = AVURLAsset(url: src)
let vTracks = try await asset.loadTracks(withMediaType: .video)
let aTracks = try await asset.loadTracks(withMediaType: .audio)
guard let vt = vTracks.first else { fputs("sem trilha de vídeo\n", stderr); exit(1) }

let reader = try AVAssetReader(asset: asset)
let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true   // moov na frente: começa a tocar sem baixar tudo

let vOut = AVAssetReaderTrackOutput(track: vt,
  outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
vOut.alwaysCopiesSampleData = false
reader.add(vOut)

let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: vbps,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoMaxKeyFrameIntervalKey: 60,
    AVVideoAllowFrameReorderingKey: true,
  ],
])
vIn.expectsMediaDataInRealTime = false
vIn.transform = try await vt.load(.preferredTransform)
writer.add(vIn)

var aOut: AVAssetReaderTrackOutput?
var aIn: AVAssetWriterInput?
if let at = aTracks.first {
  let o = AVAssetReaderTrackOutput(track: at, outputSettings: [
    AVFormatIDKey: kAudioFormatLinearPCM,
    AVLinearPCMBitDepthKey: 16, AVLinearPCMIsFloatKey: false,
    AVLinearPCMIsBigEndianKey: false, AVLinearPCMIsNonInterleaved: false,
  ])
  reader.add(o); aOut = o
  let i = AVAssetWriterInput(mediaType: .audio, outputSettings: [
    AVFormatIDKey: kAudioFormatMPEG4AAC, AVNumberOfChannelsKey: 2,
    AVSampleRateKey: 44100, AVEncoderBitRateKey: abps,
  ])
  i.expectsMediaDataInRealTime = false
  writer.add(i); aIn = i
}

reader.startReading()
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let grupo = DispatchGroup()
func bombear(_ input: AVAssetWriterInput, _ output: AVAssetReaderTrackOutput, _ fila: String) {
  grupo.enter()
  input.requestMediaDataWhenReady(on: DispatchQueue(label: fila)) {
    while input.isReadyForMoreMediaData {
      if let buf = output.copyNextSampleBuffer() { input.append(buf) }
      else { input.markAsFinished(); grupo.leave(); return }
    }
  }
}
bombear(vIn, vOut, "v")
if let i = aIn, let o = aOut { bombear(i, o, "a") }
grupo.wait()

await writer.finishWriting()
if writer.status != .completed {
  fputs("falhou: \(writer.error?.localizedDescription ?? "?")\n", stderr); exit(1)
}
print("ok")
