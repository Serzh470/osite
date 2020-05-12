/** Access to instagram account and get last 8 photos with links and captions */
const Instagram = require("node-instagram").default;

async function getInsta() {
  try {
    const instagram = new Instagram({
      accessToken: process.env.OSITE_INSTAGRAM_TOKEN,
    });
    // get last 8 photos
    const data = await instagram.get("users/self/media/recent", { count: 8 });
    return data.data.map((item) => ({
      link: item.link,
      src: item.images.standard_resolution.url,
      alt: item.caption.text,
    }));
  } catch (err) {
    console.log("no instagram data");
    return [];
  }
}

module.exports = getInsta;
