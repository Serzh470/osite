/** Access to instagram account and get last 8 photos with links and captions */
const fetch = require('node-fetch');
const fs = require('fs');

const hash = require('./hash');
const Instagram = require("node-instagram").default;


require('dotenv').config()

console.log('process.env.OSITE_INSTAGRAM_TOKEN, ', process.env.OSITE_INSTAGRAM_TOKEN)

async function getInsta() {
  try {
    const instagram = new Instagram({
      accessToken: process.env.OSITE_INSTAGRAM_TOKEN,
    });
    // get last 8 photos
    const data = await instagram.get("users/self/media/recent", { count: 9 });

    let images = data.data.map((item) => ({
      id: item.id,
      link: item.link,
      src: item.images.standard_resolution.url,
      alt: item.caption.text,
    }));

    for (image of images) {
      try {
        const data = await fetch(image.src).then(res => res.buffer());
        const name = hash(data);
        fs.writeFileSync(`dists/${name}.png`, data);
        console.log(`Instagram photo ${name}.png saved`)
        image.src = `./${name}.png` ;
      } catch (err) {
        console.log(err);
      }
    }

    return images;
  } catch (err) {
    console.log("No instagram data. Error: ", err);
    return [];
  }
}

module.exports = getInsta;
