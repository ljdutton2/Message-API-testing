require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID = 'abcde' 

describe('Message API endpoints', () => {
    beforeEach((done) => {
        const sampleMessage =  new Message({
            title: 'Test message',
            body: 'asdfghjkl',
            author: 'Lauren',
            _id: SAMPLE_OBJECT_ID
        })
        sampleMessage.save()
        .then(() => {
            done()
        })
    })
    

    afterEach((done) => {
        Message.deleteMany({ title: ['Test message','anotherMessage']})
        .then(() => {
            done()
        })
    })

    it('should load all messages', (done) => {
        chai.request(app)
        .get('/')
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an("array")
            done()
        })
    })


    it('should get one specific message', (done) => {
        chai.request(app)
        .get(`/${SAMPLE_OBJECT_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body.title).to.equal('Test message')
            expect(res.body.body).to.equal('asdfghjkl')
            done()
        })
    })

    it('should post a new message', (done) => {
        chai.request(app)
        .post('/')
        .send({title: 'anotherMessage', body: 'this is the body of the message'})
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.be.an('object')
            expect(res.body.message).to.have.property('title', 'anotherMessage')

            // check that messages is actually inserted into database
            message.findOne({title: 'anotherMessage'}).then(message => {
                expect(message).to.be.an('object')
                done()
            })
        })
    })
     
    it('should update a message', (done) => {
        chai.request(app)
        .put(`/${SAMPLE_OBJECT_ID}`)
        .send({title: 'anotherMessage'})
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.be.an('object')
            expect(res.body.message).to.have.property('title', 'anotherMessage')

            // check that message is actually inserted into database
            Message.findOne({title: 'anotherMessage'}).then(message => {
                expect(message).to.be.an('object')
                done()
            })
        })
    })


    it('should delete a message', (done) => {
        chai.request(app)
        .delete(`/${SAMPLE_OBJECT_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.equal('Successfully deleted.')
            expect(res.body._id).to.equal(SAMPLE_OBJECT_ID)

            // check that user is actually deleted from database
            User.findOne({title: 'Test Message'}).then(message => {
                expect(message).to.equal(null)
                done()
            })
        })
    })
})
