const jimp = require('jimp');

class ImageBuilder {

    buildImageMusics = async (tracks) => {

        let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let fontList = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        let mask = await jimp.read('src/assets/mascara.png');
        console.log(tracks);
        const topMusic = tracks[0];
        const listMusics = tracks.slice(1,5);

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

        listMusics.map((track, key) => {
            backGround.print(font, 20, 400 + (key * 50), `${key + 2}º - ${track.name}`);
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

        genres.map((genre, key) => {
            backGround.print(font, 40, 400 + (key * 50), `${key + 1}º - ${genre}`);
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

        jimp.read(topArtist.images[topArtist.images.length - 1].url).then(img => {
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
            listOfArtists.map((artist, key) => {
                backGround.print(fontList, 40, 400 + (key * 50), `${key + 2}º - ${artist.name}`);
            })
            backGround.composite(img, 131, 240).write('src/assets/top_artists.png');
        }).catch(erro => {
            console.log("erro:", erro);
        })
    }
}

module.exports = new ImageBuilder();

