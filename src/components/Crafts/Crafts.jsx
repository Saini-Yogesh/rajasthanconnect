import React from 'react';
import './Craftscss.css';

const CRAFTS = [
  {
    id: 1,
    category: 'Ceramic Art',
    title: 'Jaipur Blue Pottery',
    description: 'Renowned for its cobalt blue dye, Jaipur blue pottery is made of Egyptian paste rather than clay. The craft, heavily influenced by Persian artisans, features intricate floral, avian, and geometric patterns hand-painted on premium vases, plates, and tiles.',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
    tags: ['Jaipur Specialty', 'Hand-Painted', 'Cobalt Glaze']
  },
  {
    id: 2,
    category: 'Performing Folk Art',
    title: 'Traditional Kathputli Puppetry',
    description: 'A puppet show in Rajasthan is a vibrant narrative medium dating back a thousand years. Carved from a single piece of mango wood and dressed in colorful traditional fabrics, the puppets recount stories of historical kings, local legends, and social awareness.',
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80',
    tags: ['Folk Drama', 'Mango Wood', 'Cultural Legends']
  },
  {
    id: 3,
    category: 'Textile Heritage',
    title: 'Sanganeri Hand Block Printing',
    description: 'Handcrafted in Sanganer, this design features intricate floral, petal, and foliage motifs printed on fine cotton fabric using hand-carved teakwood blocks. The technique showcases the incredible rhythm and precision of master artisans using natural vegetable dyes.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    tags: ['Natural Dyes', 'Wooden Block Stamping', 'Export Quality']
  },
  {
    id: 4,
    category: 'Culinary Masterpiece',
    title: 'Dal Baati Churma Feast',
    description: 'No experience of Rajasthan is complete without this legendary dish. Baati (hard wheat rolls baked in coals) are crushed and drenched in pure ghee, served alongside spiced panchmel dal (five lentils) and sweet churma (crushed sweetened wheat).',
    image: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80',
    tags: ['Pure Ghee', 'Desert Comfort Food', 'Lentil Stew']
  }
];

export default function Crafts() {
  return (
    <section className="craftsSection" id="crafts">
      <div className="sectionHeader">
        <span className="subtitle">Heritage & Artistry</span>
        <h2 className="sectionTitle">Royal Crafts & Culinary Legends</h2>
      </div>

      <div className="craftsGrid">
        {CRAFTS.map((craft) => (
          <div key={craft.id} className="craftItem">
            <div className="craftImageContainer">
              <img 
                src={craft.image} 
                alt={craft.title} 
                className="craftImage"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            <div className="craftInfo">
              <span className="craftCategory">{craft.category}</span>
              <h3 className="craftTitle">{craft.title}</h3>
              <p className="craftText">{craft.description}</p>
              
              <div className="craftTags">
                {craft.tags.map((tag, idx) => (
                  <span key={idx} className="craftTag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
