const jimp = require('jimp');
const timeHelper = require('../helpers/time.helper');
const path = require('path');
class ImageBuilder {
    constructor() {
        this.backGroundImage = path.resolve(__dirname,'..', '..', 'assets', 'background_image_blue.jpg');
        this.mask = path.resolve(__dirname,'..', '..', 'assets', 'mascara.png');
        this.defaultProfile = path.resolve(__dirname,'..', '..', 'assets', 'black_image_profile.jpg');
    }

    buildImageMusics = async (imageId, tracks) => {
        let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        const topMusic = tracks[0];
        const listMusics = tracks.slice(1, 5);

        const backGround = await jimp.read(this.backGroundImage);
        backGround.resize(400, 844);
        backGround.color([
            { apply: 'brighten', params: [-25] },
        ]);
        backGround.print(font, 0, -200, {
            "text": `Mais Ouvida`,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
        },
            400,
            844
        );
        backGround.print(font, 0, -140, {
            "text": `${topMusic._id}`,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
        },
            400,
            844
        );

        backGround.print(font, 0, -70, {
            "text": `Ouviu Bastante`,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
        },
            400,
            844
        );
        let begins = 380;
        let lastLength = 10;
        listMusics.map((track, key) => {
            if(lastLength >= 20){
                begins += 80
            }else{
                begins += 50;
            }
            backGround.print(font, 20, begins, {
                "text": `${key + 2}º - ${track._id}`,
                alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
            },
                400,
                844
            );

            lastLength = track._id.length
        });

        await backGround.writeAsync(path.resolve(__dirname,'..', '..', '..', 'tmp', `${imageId}-top-musics.png`));
    }

    buildImageHoursAndGenres = async (imageId, genres, msListened) => {

        let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        const backGround = await jimp.read(this.backGroundImage);
        const hoursListened  = timeHelper(msListened.sum);

        backGround.resize(400, 844);
        backGround.color([
            { apply: 'brighten', params: [-25] },
        ]);
        backGround.print(font, 0, -200, {
            "text": `Horas Ouvidas`,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
        },
            400,
            844
        );
        backGround.print(font, 0, -140, {
            "text": `${hoursListened}`,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
        },
            400,
            844
        );

        backGround.print(font, 0, -70, {
            "text": `Gêneros Ouvidos`,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
        },
            400,
            844
        );

        let lastLength = 10;
        let yPix = 400;
        genres.map((genre, key) => {
            if(lastLength >= 20){
                yPix += 70;
            }
            else{
                yPix += 50;
            }

            backGround.print(font, 20, yPix, {
                "text": `${key + 1}º - ${genre._id}`,
                alignmentX: jimp.HORIZONTAL_ALIGN_LEFT
            },
                400,
                844
            );
            lastLength = genre._id.length;
        });

       await backGround.writeAsync(path.resolve(__dirname,'..', '..', '..', 'tmp', `${imageId}-hours-and-genres.png`));
    }

    buildImageTopArtist = async (imageId, artists) => {
        const topArtist = artists[0];
        const listOfArtists = artists.slice(1, 5);

        let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let fontList = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let mask = await jimp.read(this.mask);
        const backGround = await jimp.read(this.backGroundImage);
        const profilePath = topArtist.images[topArtist.images.length - 1] && topArtist.images[topArtist.images.length - 1].url? topArtist.images[topArtist.images.length - 1].url : 'src/assets/black_image_profile.jpg'  
        
        jimp.read(profilePath).then(img => {
            img.resize(130, 130);
            mask.resize(130, 130);
            backGround.resize(400, 844);
            img.mask(mask);
            backGround.color([
                { apply: 'brighten', params: [-25] },
            ])
            backGround.opacity(1);
            backGround.print(font, 0, -200, {
                "text": `1º - ${topArtist._id}`,
                alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
            },
                400,
                844);
            let yPix = 400;
            let lastLength = 10;
            listOfArtists.map((artist, key) => {
                if(lastLength >= 20){
                    yPix += 80;
                }else {
                    yPix += 50;
                }
                backGround.print(fontList, 20, yPix, {
                    "text": `${key + 2}º - ${artist._id}`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_LEFT
                },
                400,
                844
                );
                lastLength = artist._id.length;
            })
            backGround.composite(img, 131, 240).write(path.resolve(__dirname,'..', '..', '..', 'tmp', `${imageId}-top-artists.png`));
        }).catch(erro => {
            console.log("erro:", erro);
        })
    }
}

module.exports = new ImageBuilder();

