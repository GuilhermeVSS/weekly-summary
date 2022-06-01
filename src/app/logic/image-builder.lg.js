const jimp = require('jimp');

const topArtists = [
    {
        "name": "Eminem",
        "image": "https://i.scdn.co/image/ab6761610000f178a00b11c129b27a88fc72f36b"
    }
]


const frase = `2º - Kanye West\n3º - Jorja Smith\n4º - Bring me the horizon\n`;

class ImageBuilder {
    buildImageTopArtist = async (artists) => {
        const topArtist = artists[0];
        const listOfArtists = artists.slice(1,10);
        console.log("TOP ARTISTS", topArtist);
        let font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
        let fontList = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
        // let font = await jimp.loadFont('src/fonts/white_poppins_20.fnt');
        // let fontList = await jimp.loadFont('src/fonts/white_poppins_20.fnt');
        let mask = await jimp.read('src/assets/mascara.png');
        const backGround = await jimp.read('src/assets/background_image_blue.jpg');
        // const imageUrl = topArtist.image
        jimp.read(topArtist.images[topArtist.images.length-1].url).then(img => {
            img.resize(130, 130);
            mask.resize(130, 130);
            backGround.resize(390, 844);
            img.mask(mask);
            backGround.color([
                { apply: 'brighten', params: [-25] },
            ])
            backGround.opacity(1);
            backGround.print(font, 0, -200, {
                "text": `1º - ${topArtist.name}`,
                alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
            },
                390,
                844);
            listOfArtists.map((artist, key) => {
                backGround.print(fontList, 40, 400 + (key * 50), `${key+2}º - ${artist.name}`);
            })
            backGround.composite(img, 131, 240).write('src/assets/beta_6.png');
        }).catch(erro => {
            console.log("erro:", erro);
        })
    }
}

module.exports = new ImageBuilder();

