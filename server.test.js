const mongoose = require('mongoose');
const chai = require('chai');
const chaitHTTP = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
const server = require('./server');

chai.use(chaitHTTP);

const Game = require('./models');

describe('Games', () => {
  before(done => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/test');
    const db = mongoose.connection;
    db.on('error', () => console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('we are connected');
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
      console.log('we are disconnected');
    });
  });
  // declare some global variables for use of testing
  // hint - these wont be constants because you'll need to override them.
  beforeEach(async () => {
    // write a beforeEach hook that will populate your test DB with data
    // each time this hook runs, you should save a document to your db
    // by saving the document you'll be able to use it in each of your `it` blocks
    const game1 = new Game({
      title: 'Excitebike',
      genre: 'Racing',
      date: 'November 30, 1984'
    });
    const game2 = new Game({
      title: 'Code Name: Viper',
      genre: 'Action/Shooter',
      date: 'March 1990'
    });
    await game1.save();
    await game2.save();
  });
  afterEach(done => {
    // simply remove the collections from your DB.
    Game.remove({}, (err) => {
      if (err) {
        console.error(err);
      }
      done();
    });
  });

  // test the POST here
  describe('[POST] /api/game/create', () => {
    it ('should return the newly added game', (done) => {
      const game = {
        title: 'Pro Wrestling',
        genre: 'Fighting/Sports',
        date: 'March 1987'
      };

      chai.request(server)
        .post('/api/game/create')
        .send(game)
        .end((err, res) => {
          if (err) {
            console.error(err);
            return done();
          }
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('Pro Wrestling');
          done();
        });
    });
  });

  // test the GET here
  describe('[GET] /api/game/get', () => {
    it('should return the games in the database', (done) => {
      chair.request(server)
        .get('/api/game/get')
        .end((err, res) => {
          if (err) {
            console.error(err);
            return done();
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
          done();
        })
    });
  });

  // test the PUT here

  // --- Stretch Problem ---
  // Test the DELETE here
});
