import './faq-mobile.css';
import FitaFaq from '../FitaFaq.jsx';
import AcordeaoFaq from '../AcordeaoFaq.jsx';

export default function FaqMobile() {
  return (
    <section className="faq-m">
      <div className="faq-m__kicker">FAQ</div>
      <h2 className="faq-m__title">
        Perguntas
        <br />
        frequentes
      </h2>

      <FitaFaq className="faq-m__fita" />

      <AcordeaoFaq />
    </section>
  );
}
