import React from "react";

export default function EtiquettePanel() {
  return (
    <div className="panelEtiquette">
      <div className="etiquetteGrid">
        
        {/* Etiquette card */}
        <div className="infoBlockCard">
          <h3>🤝 Cultural Etiquettes & Guest Norms</h3>
          <p>
            Rajasthanis treat guests as manifestations of God (represented by the Sanskrit maxim <em>"Atithi Devo Bhava"</em>). 
            When traveling, keeping these custom behaviors in mind is helpful:
          </p>
          <div className="guidelinePoints">
            <div className="pointRow">
              <strong>🙏 Greetings</strong>
              <p>Greet locals with folded hands saying <em>"Khamma Ghani"</em> or <em>"Namaste"</em>. It shows high respect.</p>
            </div>
            <div className="pointRow">
              <strong>🥾 Footwear</strong>
              <p>Always remove your shoes before entering temples, shrines, residential kitchens, or carpeted living rooms.</p>
            </div>
            <div className="pointRow">
              <strong>📸 Photography Consent</strong>
              <p>Ask for permission before photographing women, children, active religious rites, or residential properties.</p>
            </div>
            <div className="pointRow">
              <strong>👗 Appropriate Dress</strong>
              <p>Dress modestly, keeping shoulders and knees covered when visiting sacred shrines and holy spaces.</p>
            </div>
          </div>
        </div>

        {/* Pilgrimage Circuits */}
        <div className="infoBlockCard">
          <h3>🙏 Famous Pilgrimage Circuits</h3>
          <p>Rajasthan is a holy sanctuary for multiple faiths, featuring centuries-old shrines and ashrams:</p>
          <div className="circuitList">
            <div className="circuitRow">
              <h4>Pushkar (Brahma Temple)</h4>
              <p>One of the very few temples in the world dedicated to Lord Brahma. Surrounding the holy Pushkar Lake, it is a crucial site for Hindu devotees.</p>
            </div>
            <div className="circuitRow">
              <h4>Ajmer Sharif Dargah</h4>
              <p>The shrine of Sufi saint Hazrat Khwaja Moinuddin Chishti. It is visited by millions of people across all religions seeking blessings.</p>
            </div>
            <div className="circuitRow">
              <h4>Dilwara Jain Temples (Mount Abu)</h4>
              <p>A group of five marble temples built between the 11th and 13th centuries, legendary for their unparalleled stone engravings.</p>
            </div>
            <div className="circuitRow">
              <h4>Karni Mata Temple (Deshnoke)</h4>
              <p>Known globally as the Temple of Rats, where thousands of black rats (kabbas) are considered sacred and fed milk daily.</p>
            </div>
          </div>
        </div>

        {/* Royal Weddings */}
        <div className="infoBlockCard fullWidthBlock">
          <h3>👑 Royal Weddings & Destination Venues</h3>
          <p>
            Rajasthan is globally renowned as the ultimate destination for luxury royal weddings. 
            Couples from across the globe choose the heritage hotels, floating lake palaces, and historic forts of Udaipur, Jaipur, and Jodhpur for weddings:
          </p>
          <div className="weddingGrid">
            <div className="weddingVenue">
              <strong>Taj Lake Palace (Udaipur)</strong>
              <p>A floating white-marble palace on Lake Pichola, offering a fairy-tale royal heritage backdrop.</p>
            </div>
            <div className="weddingVenue">
              <strong>Umaid Bhawan Palace (Jodhpur)</strong>
              <p>One of the world's largest private residences, constructed with yellow sandstone, hosting high-profile weddings.</p>
            </div>
            <div className="weddingVenue">
              <strong>Rambagh Palace (Jaipur)</strong>
              <p>The former residence of the Maharaja of Jaipur, featuring sprawling Mughal gardens and royal banquet halls.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
