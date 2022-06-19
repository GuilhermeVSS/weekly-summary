const jimp = require('jimp');

class ImageBuilder {

    buildImageMusics = async (tracks) => {

        let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let fontList = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
        let mask = await jimp.read('src/assets/mascara.png');
        const topMusic = tracks[0];
        const listMusics = tracks.slice(1, 5);

        const backGround = await jimp.read('src/assets/background_image_blue.jpg');
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
            "text": `${topMusic.name}`,
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
                "text": `${key + 2}º - ${track.name}`,
                alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
            },
                400,
                844
            );

            lastLength = track.name.length
        });

        backGround.write('src/assets/top_musics.png');
    }

    buildImageHoursAndGenres = async (genres, hoursListened) => {

        let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let fontList = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let mask = await jimp.read('src/assets/mascara.png');
        const backGround = await jimp.read('src/assets/background_image_blue.jpg');
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
                "text": `${key + 1}º - ${genre}`,
                alignmentX: jimp.HORIZONTAL_ALIGN_LEFT
            },
                400,
                844
            );
            lastLength = genre.length;
        });

        backGround.write('src/assets/hours_and_genres.png');
    }

    buildImageTopArtist = async (artists) => {
        const topArtist = artists[0];
        const listOfArtists = artists.slice(1, 5);
        let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let fontList = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let mask = await jimp.read('src/assets/mascara.png');
        const backGround = await jimp.read('src/assets/background_image_blue.jpg');
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
                "text": `1º - ${topArtist.name}`,
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
                    "text": `${key + 2}º - ${artist.name}`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_LEFT
                },
                400,
                844
                );
                lastLength = artist.name.length;
            })
            backGround.composite(img, 131, 240).write('src/assets/top_artists.png');
        }).catch(erro => {
            console.log("erro:", erro);
        })
    }
}

module.exports = new ImageBuilder();

