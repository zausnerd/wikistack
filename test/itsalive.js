var chai = require('chai');
var spies = require('chai-spies');
var expect = require('chai').expect;
var index = require('../models/index');
var Page = index.Page;
var User = index.User;
var chalk = require('chalk');
chai.use(spies);

 // console.log(Page);


describe('Page model', function() {
  var page, page1, page2;

  beforeEach(function(done) {
    page = new Page();
    // page.urlTitle = 'some_title';
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
        // console.dir(page);
        expect(page.renderedContent).to.equal('<p>I am using <strong>markdown</strong>.</p>\n');
        done();
      });
    });
  });




  describe('Statics', function() {
      describe('findByTag', function() {
        it('gets pages with the example tag', function(done) {
          Page.findByTag('example').then(function (pages) {
            // console.log(pages);
            expect(pages[0].title).to.equal('some_title');
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
          expect(pages.title).to.not.equal('another one');
          done();
        }).then(null,done);
      });

      it('gets other pages with any common tags',function(done) {
        page3.findSimilar().then(function(results) {
          expect(results.length).to.equal(0);
          done();
        }).then(null,done);
      });


      it('does not get other pages without any common tags');
    });
  });

  describe('Validations', function() {
    it('errors without title');
    it('errors without content');
    it('errors given an invalid status');
  });

  describe('Hooks', function() {
    it('it sets urlTitle based on title before validating');
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
