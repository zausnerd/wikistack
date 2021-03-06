var chai = require('chai');
var spies = require('chai-spies');
var expect = require('chai').expect;
var index = require('../models/index');
var Page = index.Page;
var User = index.User;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
chai.use(spies);


describe('Page model', function() {
  var page, page1, page2;

  beforeEach(function(done) {
    page = new Page();
    page.title = 'some_title';
    page.content = 'I am using __markdown__.';
    page.tags = ['example'];
    page.save()
    .then(function() {
      page1 = new Page();
      page1.title = 'another one';
      page1.content = 'you smart, real smart';
      page1.tags = ['example', 'function', 'here'];
      page1.save().then(function() {
        page3 = new Page();
        page3.title = 'the third page';
        page3.content = 'third content';
        page3.tags = ['dont', 'jump', 'its'];
        page3.save().then(function() {
          done();
        })
      })
    })
    .then(null, done);
  });

  afterEach(function(done){
    Page.collection.drop();
    done();
  });


  describe('Virtuals', function() {
    describe('route', function() {
      it('returns the url_name prepended by "/wiki/"',function(done) {
        expect(page.route).to.equal('/wiki/some_title');
        done();
      });

    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function(done) {
        expect(page.renderedContent).to.equal('<p>I am using <strong>markdown</strong>.</p>\n');
        done();
      });
    });
  });




  describe('Statics', function() {
      describe('findByTag', function() {
        it('gets pages with the example tag', function(done) {
          Page.findByTag('example').then(function (pages) {
            expect(pages[0].title).to.equal('some_title');
            expect(pages.length).to.equal(2);
            done();
          }).then(null, done);
        });

        it('does not get pages without the search tag', function(done) {
          Page.findByTag('isdfd').then(function (pages) {
            expect(pages[0]).to.not.equal('some_title');
            done();
          }).then(null, done);
        });
      });
    });

  describe('Methods', function() {
    describe('findSimilar', function() {
      it('never gets itself',function(done) {
        page1.findSimilar().then(function(pages) {
          pages.forEach(function(page) {
            expect(page.title).to.not.equal('another one');
            done();
          });
        }).then(null,done);
      });

      it('gets other pages with any common tags',function(done) {
        page1.findSimilar().then(function(results) {
          expect(results.length).to.equal(1);
          done();
        }).then(null,done);
      });


      it('does not get other pages without any common tags',function(done) {
        page1.findSimilar().then(function(results) {
          results.forEach(function (result) {
            expect(result.title).to.not.equal('the third page');
            done();
          });
        }).then(null,done);
      });
    });
  });

  //run using native promise + catch, praise v8, thy power be c++
  describe('Validations', function() {
    it('errors without title',function(done) {
      pageNope = new Page();
      pageNope.content = 'lol';
      pageNope.tags = ['ha', 'ha', 'ha'];
      pageNope.save().then(function(data) {
        // assert.fail('this should fail');
        console.log("*********");
        done();
      })
      // .then(null, function(error) {
      //   test stuff here
      //   done();
      // })
      .catch(function(error) {
        expect(error.message).to.equal('Page validation failed');
        done();
      });
    });

    // callbacks options
    // pageNope.save(function(error) {
    //   expect(error.message).to.equal('Page validation failed');
    //   done();
    // });


    it('errors without content',function(done) {
        pageNope = new Page();
        pageNope.tags = ['ha', 'ha', 'ha'];
        pageNope.save().then(function(data) {
          assert.fail('stay away from they');
          done();
        }).catch(function(error) {
          expect(error.message).to.equal('Page validation failed');
          done();
        });
    });

    it('errors given an invalid status',function(done){
      pageNope = new Page();
      pageNope.title = "So good title";
      pageNope.content = "very good content";
      pageNope.status = "not good status";
      pageNope.save().then(function(data){
        console.log("this shouldn't run");
        done();
      }).catch(function(error){
        expect(error.message).to.equal('Page validation failed');
        done();
      })
    });
  });

  describe('Hooks', function() {
    it('it sets urlTitle based on title before validating', function(done) {
      var pageYes = new Page({title: 'keys to success', tags: ['chef', 'dee'], content: 'good morning'});
      expect(pageYes.urlTitle).to.equal(undefined);
      return pageYes.validate().then(function() {
        expect(pageYes.urlTitle).to.equal('keys_to_success');
        done();
      }).then(null,done);
    });
  });


  describe('GET /', function() {
    it('gets 200 on index', function(done) {
        agent.get('/').expect(200, done);
    });

    it('gets 200 on wiki/add', function(done) {
        agent.get('/wiki/add').expect(200, done);
    });

    it('gets 404 on Wethebest', function(done) {
        agent.get('/wiki/WeTheBest').expect(404, done);
    });

    it('Post /wiki', function(done) {
      agent.post('/wiki/')
          .send({content: '2', name: 'wethebest', status: 'open', title: 'wethebest', email: 'fake@email.com', tags: 'test again'})
          .expect(302,function() {
          agent.get('/wiki/wethebest').expect(200, done);
          });
    });

    .expect(302)
    .end(function(err,res){
      Page.find({title:adfdafa}).then(function(page){
        expect
      }
    })
    // it('gets 200 on Wethebest', function(done) {
    //
    // });

    // it('gets 200 on now created Wethebest', function(done)
    // });

  });


});












































// // expect.use(spies);
// // var supertes = require('supertest');
//
// describe('simple test', function() {
//   beforeEach(function() {
//     console.log('funkmaster flex night');
//   });
//
//   //async test
//   describe('simple addition', function() {
//     it('super simple addition, 2+ 2', function() {
//       expect(2+2).to.equal(4);
//     });
//   });
//
//   //async test
//
//   describe('async', function() {
//       it('save async', function(done) {
//         var startTime = new Date();
//         setTimeout(function() {
//           var durationTime = new Date() - startTime;
//           expect(durationTime).to.be.closeTo(1000,5);
//           done();
//         }, 1000);
//       });
//   });
//
// // spy test
// describe('forEach', function() {
//   // it("counts times called", function() {
//   //   var testArr =[1,2,3,4,5];
//   //
//   //   function test(arr, count){
//   //     if(count> arr.length){
//   //       return;
//   //     }
//   //     console.log("Still funkmaster flex night");
//   //     count++;
//   //     test(arr,count);
//   //   }
//   //
//   //   spy = chai.spy(test(testArr, 0));
//   //   console.log(spy);
//   //
//   //
//   //   expect(spy).to.have.been.called.exactly(6);
//   // })
//
//
//   it('will invoke a function once per element', function () {
//     var arr = ['x','y','z'];
//     function logNth (val, idx) {
//         console.log('Logging elem #'+idx+':', val);
//     }
//     logNth = chai.spy(logNth);
//     arr.forEach(logNth);
//     expect(logNth).to.have.been.called.exactly(arr.length);
//   });
// });
