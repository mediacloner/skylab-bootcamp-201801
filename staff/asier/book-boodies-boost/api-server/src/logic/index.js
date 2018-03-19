const books = require('google-books-search')
const { User, Review, Book } = require('../models')

const defaultPic = 'http://ring49magic.com/blog/wp-content/plugins/google-bookshelves/images/no_cover_thumb.png'

const googleBookProps = ['authors', 'categories', 'description', 'id', 'industryIdentifiers', 'pageCount', 'publishDate', 'thumbnail', 'title']

module.exports = {

    retrieveGeneralSearch(query) {

        const options = {
            limit: 20,
            type: 'books',
            lang: 'es'
        };

        return new Promise((resolve, reject) => {


            books.search(query, options,
                (error, results) => {
                    if (!error) {

                        results = results.map((book) => {

                            book.authors ? book.authors[0] : book.authors = ["Varios Autores"]

                            if (!book.title) {
                                book.title = "Este libro no cuenta con título"
                            } else if (book.title.length > 45) {
                                book.title = book.title.substring(0, 45) + "..."
                            } else {
                                book.title
                            }


                            if (!book.description) {
                                book.description = "Este libro no cuenta con descripción."
                            } else if (book.description.length > 160) {
                                book.description = book.description.substring(0, 160) + "..."
                            } else {
                                book.description
                            }

                            !book.thumbnail ? book.thumbnail = defaultPic : book.thumbnail


                            return book

                        })


                        resolve(results)


                    } else {
                        reject(error)
                    }
                })
        })
    },

    retrieveCategory(query) {

        const options = {
            field: 'subject',
            limit: 40,
            type: 'books',
            lang: 'es'
        };

        return new Promise((resolve, reject) => {


            books.search(query, options,
                (error, results) => {
                    if (!error) {

                        results = results.map((book) => {

                            book.authors ? book.authors[0] : book.authors = ["Varios Autores"]

                            if (!book.title) {
                                book.title = "Este libro no cuenta con título"
                            } else if (book.title.length > 45) {
                                book.title = book.title.substring(0, 45) + "..."
                            } else {
                                book.title
                            }


                            if (!book.description) {
                                book.description = "Este libro no cuenta con descripción."
                            } else if (book.description.length > 160) {
                                book.description = book.description.substring(0, 160) + "..."
                            } else {
                                book.description
                            }

                            !book.thumbnail ? book.thumbnail = defaultPic : book.thumbnail


                            return book

                        })


                        resolve(results)


                    } else {
                        reject(error)
                    }
                })
        })

    },

    retrieveAuthor(query) {

        const options = {
            field: 'author',
            limit: 40,
            order: "newest",
            lang: 'es'
        };

        return new Promise((resolve, reject) => {


            books.search(query, options,
                (error, results) => {
                    if (!error) {
                        resolve(results)
                    } else {
                        resolve(error)
                    }
                })

        })

    },

    retrieveBook(id) {
        return Promise.resolve()
            .then(() => {
                if (!id) throw Error('id should be valid')

                const book = {}

                const promises = [
                    new Promise((resolve, reject) => {
                        books.lookup(id, (error, results) => {
                            if (error) return reject(error)

                            googleBookProps.forEach(prop => book[prop] = results[prop])

                            resolve()
                        })
                    }),
                    Book.findOne({ id })
                        .then(_book => book.reviews = _book.reviews)
                ]

                return Promise.all(promises)
                    .then(() => book)
            })
    },



    /* retrieveBook(id) {

        return new Promise((resolve, reject) => {


            books.lookup(id,
                (error, results) => {
                    if (!error) {
                        resolve(results)
                    } else {
                        resolve(error)
                    }
                })

        })
    }, */

}