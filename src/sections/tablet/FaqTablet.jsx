import './faq-tablet.css';
import FitaFaq from '../FitaFaq.jsx';
import AcordeaoFaq from '../AcordeaoFaq.jsx';

export default function FaqTablet() {
  return (
    <section className="faq-t">
      <FitaFaq className="faq-t__fita" />

      <div className="faq-t__col">
        <div className="faq-t__kicker">FAQ</div>
        <h2 className="faq-t__title">
          Perguntas
          <br />
          frequentes
        </h2>
        <AcordeaoFaq />
      </div>
    </section>
  );
}
