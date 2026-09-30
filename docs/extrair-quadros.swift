// Extrai quadros de um vídeo em tempos específicos, sem depender de ffmpeg.
//
// Uso: swift docs/extrair-quadros.swift <video> <pasta-destino> <t1> <t2> ...
// Os tempos são em segundos, com decimais. Cada quadro sai como
// quadro-<t>.png na pasta de destino.
//
// Existe pelo mesmo motivo do encode-video.swift: o macOS já traz o
// AVFoundation, e instalar ffmpeg só para ler alguns quadros não se paga.
import AVFoundation
import Foundation
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count >= 4 else {
    FileHandle.standardError.write("uso: extrair-quadros.swift <video> <pasta> <t1> [t2 ...]\n".data(using: .utf8)!)
    exit(2)
}

let origem = URL(fileURLWithPath: args[1])
let pasta = URL(fileURLWithPath: args[2], isDirectory: true)
let tempos = args.dropFirst(3).compactMap(Double.init)

try? FileManager.default.createDirectory(at: pasta, withIntermediateDirectories: true)

let asset = AVURLAsset(url: origem)
let gerador = AVAssetImageGenerator(asset: asset)
gerador.appliesPreferredTrackTransform = true
// Sem tolerância: pedir o quadro de 2,20s e receber o de 2,05s inverteria a
// ordem de entrada dos elementos justamente onde a conferência importa.
gerador.requestedTimeToleranceBefore = .zero
gerador.requestedTimeToleranceAfter = .zero

let sem = DispatchSemaphore(value: 0)
var duracao: Double = 0
Task {
    if let d = try? await asset.load(.duration) { duracao = CMTimeGetSeconds(d) }
    sem.signal()
}
sem.wait()
print("duração: \(String(format: "%.2f", duracao))s")

for t in tempos {
    let tempo = CMTime(seconds: t, preferredTimescale: 600)
    do {
        let cg = try gerador.copyCGImage(at: tempo, actualTime: nil)
        let rep = NSBitmapImageRep(cgImage: cg)
        guard let dados = rep.representation(using: .png, properties: [:]) else { continue }
        let destino = pasta.appendingPathComponent(String(format: "quadro-%.2f.png", t))
        try dados.write(to: destino)
        print("ok \(String(format: "%.2f", t))s -> \(destino.lastPathComponent) (\(cg.width)x\(cg.height))")
    } catch {
        print("falhou \(String(format: "%.2f", t))s: \(error.localizedDescription)")
    }
}
