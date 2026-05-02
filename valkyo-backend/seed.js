require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const PRODUCTS = [
  { name:"Radiance Glow Serum", cat:"skincare", emoji:"💧", price:68, oldPrice:null, rating:4.9, reviews:312, badge:"bestseller", desc:"A lightweight, fast-absorbing serum packed with vitamin C, hyaluronic acid, and wild-harvested rosehip extract. Visibly brightens skin in 2 weeks.", sizes:["15ml","30ml","50ml"], ingredients:"Aqua, Ascorbic Acid, Rosa Canina, Hyaluronic Acid, Niacinamide", stock:100 },
  { name:"Rose Petal Cream", cat:"skincare", emoji:"🌹", price:52, oldPrice:null, rating:4.8, reviews:218, badge:"new", desc:"A rich, velvety moisturizer infused with Damascene rose extract and ceramides. Deeply nourishes and restores your skin barrier overnight.", sizes:["50ml","100ml"], ingredients:"Rosa Damascena, Ceramide NP, Glycerin, Shea Butter", stock:100 },
  { name:"Luminous Silk Foundation", cat:"skincare", emoji:"✨", price:44, oldPrice:55, rating:4.7, reviews:185, badge:"sale", desc:"A buildable, skin-like foundation with SPF 20. Blends seamlessly for a luminous, second-skin finish that lasts all day.", sizes:["Fair","Light","Medium","Tan","Deep"], ingredients:"Cyclopentasiloxane, Titanium Dioxide, Niacinamide, Vitamin E", stock:100 },
  { name:"Gold Eye Elixir", cat:"eyes", emoji:"✨", price:76, oldPrice:null, rating:5.0, reviews:98, badge:"bestseller", desc:"A concentrated eye serum with 24k gold particles, peptides, and caffeine to depuff, brighten, and firm the delicate eye area.", sizes:["10ml","20ml"], ingredients:"Aurum, Palmitoyl Tripeptide-5, Caffeine, Retinol 0.1%", stock:100 },
  { name:"Velvet Lip Elixir", cat:"lips", emoji:"💄", price:34, oldPrice:null, rating:4.8, reviews:276, badge:"new", desc:"A nourishing lip treatment that delivers a glossy, plumped finish. Infused with rose oil, vitamin E, and peppermint for a kissable pout.", sizes:["Rose Nude","Berry","Coral","Classic Red"], ingredients:"Ricinus Communis, Rosa Canina, Tocopherol, Menthol", stock:100 },
  { name:"Botanic Body Butter", cat:"body", emoji:"🌸", price:42, oldPrice:null, rating:4.6, reviews:144, badge:null, desc:"A luxurious whipped body butter with shea, mango butter, and jasmine extract. Melts into skin for all-day moisture and radiance.", sizes:["150ml","250ml"], ingredients:"Butyrospermum Parkii, Mangifera Indica, Jasminum Officinale", stock:100 },
  { name:"Damascus Rose Eau de Parfum", cat:"fragrance", emoji:"🌹", price:128, oldPrice:null, rating:4.9, reviews:67, badge:"luxury", desc:"A sophisticated floral fragrance opening with fresh bergamot, a heart of Damascene rose, and a warm base of sandalwood and musk.", sizes:["30ml","50ml","100ml"], ingredients:"Alcohol Denat., Rosa Damascena, Citrus Bergamia, Santalum Album", stock:100 },
  { name:"Brightening Eye Palette", cat:"eyes", emoji:"💫", price:58, oldPrice:72, rating:4.7, reviews:203, badge:"sale", desc:"12 curated shades spanning from silk nudes to deep smoldering plums. Ultra-pigmented, long-wear formula with a buttery texture.", sizes:["1 size"], ingredients:"Mica, Isostearyl Neopentanoate, Dimethicone, Vitamin E", stock:100 },
  { name:"Micellar Cleansing Water", cat:"skincare", emoji:"💦", price:28, oldPrice:null, rating:4.7, reviews:331, badge:null, desc:"A gentle yet effective micellar water that removes even stubborn waterproof makeup without stripping. Formulated for all skin types.", sizes:["150ml","400ml"], ingredients:"Aqua, Poloxamer 184, Glycerin, Chamomilla Recutita Extract", stock:100 },
  { name:"Plum Matte Lip Ink", cat:"lips", emoji:"💜", price:29, oldPrice:null, rating:4.5, reviews:189, badge:null, desc:"A long-lasting liquid lip color with a transfer-proof matte finish. Lightweight formula that never dries out your lips.", sizes:["Plum Noir","Berry Stain","Wine Red","Dusty Rose"], ingredients:"Aqua, PVP, Silica, Trimethylsiloxysilicate, Vitamin C", stock:100 },
  { name:"Jasmine Body Scrub", cat:"body", emoji:"🌺", price:36, oldPrice:null, rating:4.6, reviews:112, badge:null, desc:"A luxurious sugar scrub infused with jasmine oil and pink Himalayan salt. Buffs away dead skin, leaving a silky, radiant glow.", sizes:["200ml"], ingredients:"Sucrose, Sodium Chloride, Jasminum Sambac, Rosa Canina, Glycerin", stock:100 },
  { name:"Gold Ritual Gift Set", cat:"sets", emoji:"🎁", price:148, oldPrice:180, rating:5.0, reviews:44, badge:"sale", desc:"The ultimate luxury gifting set featuring our Glow Serum, Rose Petal Cream, and Gold Eye Elixir — nestled in a keepsake gold box.", sizes:["1 set"], ingredients:"See individual products", stock:100 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    await Product.deleteMany({});
    console.log('🗑️ Old products cleared');
    for (const p of PRODUCTS) {
      const slug = p.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      await Product.create({ ...p, slug });
    }
    console.log('✅ All 12 products added!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
