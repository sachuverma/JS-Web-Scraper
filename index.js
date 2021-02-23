const request = require("request-promise"),
  cheerio = require("cheerio"),
  fs = require("fs"),
  json2csv = require("json2csv").Parser;

const movies = [
  "https://www.imdb.com/title/tt0419058/",
  "https://www.imdb.com/title/tt0242519/?ref_=fn_al_tt_1",
  "https://www.imdb.com/title/tt0374887/?ref_=tt_sims_tt",
];

(async () => {
  let imdbData = [];

  for (let movie of movies) {
    const response = await request({
      uri: movie,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,la;q=0.6",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1').text().trim();
    let rating = $('div[class="ratingValue"] > strong > span').text();
    let summary = $('div[class="summary_text"]').text().trim();
    let release_date = $('a[title="See more release dates"]').text().trim();

    imdbData.push({ title, rating, summary, release_date });
  }

  const j2cp = new json2csv();
  const csv = j2cp.parse(imdbData);

  fs.writeFileSync("./imdb.csv", csv, "utf-8");
})();
