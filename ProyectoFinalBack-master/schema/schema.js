const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const User = require("../models/user");
const Area = require("../models/area");
const Request = require("../models/request");
const Record = require("../models/record");
const sendEmail = require("../utils/mail");
const generatePdf = require("../utils/generatePdf");
const File = require("../models/file");
const { saveFile, isBase64 } = require("../utils/fileManager");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;

const RecordType = new GraphQLObjectType({
  name: "Record",
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      async resolve(parent, args) {
        const result = await User.findById(parent.userId);
        return result;
      }
    },
    action: { type: GraphQLString },
    date: { type: GraphQLString },
    time: { type: GraphQLString }
  })
});

const AreaType = new GraphQLObjectType({
  name: "Area",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString }
  })
});

const FileType = new GraphQLObjectType({
  name: "File",
  fields: () => ({
    id: { type: GraphQLID },
    url: { type: GraphQLString }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    area: {
      type: AreaType,
      async resolve(parent, args) {
        const result = await Area.findById(parent.areaId);
        return result;
      }
    },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    userType: { type: GraphQLString },
    active: { type: GraphQLBoolean }
  })
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    area: {
      type: AreaType,
      async resolve(parent, args) {
        const result = await Area.findById(parent.areaId);
        return result;
      }
    },
    author: {
      type: UserType,
      async resolve(parent, args) {
        const result = await User.findById(parent.authorId);
        return result;
      }
    },
    request: {
      type: RequestType,
      async resolve(parent, args) {
        const result = await Request.findById(parent.requestId);
        return result;
      }
    },
    stateRepresentative: { type: GraphQLString },
    stateCoordinator: { type: GraphQLString },
    fileWithNames: { type: GraphQLString },
    fileWithoutNames: { type: GraphQLString },
    dictamenOne: { type: GraphQLString },
    dictamenTwo: { type: GraphQLString },
    dictamenThree: { type: GraphQLString },
    correctedBook: { type: GraphQLString },
    ISBN: { type: GraphQLString },
    fileISBN: { type: GraphQLString },
    acceptedBook: { type: GraphQLString },
    armado: { type: GraphQLString },
    ready: { type: GraphQLString },
    agradecimiento1: { type: GraphQLString },
    agradecimiento2: { type: GraphQLString },
    agradecimiento3: { type: GraphQLString },
    requestUrl: { type: GraphQLString }
  })
});

const RequestType = new GraphQLObjectType({
  name: "Request",
  fields: () => ({
    id: { type: GraphQLID },
    bookName: { type: GraphQLString },
    area: {
      type: AreaType,
      async resolve(parent, args) {
        const result = await Area.findById(parent.areaId);
        return result;
      }
    },
    author: {
      type: UserType,
      async resolve(parent, args) {
        const result = await User.findById(parent.authorId);
        return result;
      }
    },
    justification: { type: GraphQLString },
    docenciaActive: { type: GraphQLBoolean },
    docenciaPriority: { type: GraphQLString },
    docenciaJustification: { type: GraphQLString },
    docenciaKindOfText: { type: GraphQLString },
    researchActive: { type: GraphQLBoolean },
    researchPriority: { type: GraphQLString },
    difusionActive: { type: GraphQLBoolean },
    difusionPriority: { type: GraphQLString },
    myPublic: { type: GraphQLString },
    market: { type: GraphQLString },
    numberOfBooks: { type: GraphQLString },
    financing: { type: GraphQLString },
    autorization: { type: GraphQLBoolean }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    area: {
      type: AreaType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args) {
        const result = await Area.findOne({
          _id: args.id
        });
        return result;
      }
    },
    areas: {
      type: new GraphQLList(AreaType),
      async resolve(parent, args) {
        const result = await Area.find({});
        return result;
      }
    },
    records: {
      type: new GraphQLList(RecordType),
      async resolve(parent, args) {
        const result = await Record.find({});
        return result;
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args) {
        const result = await User.findOne({
          _id: args.id,
          active: true
        });
        return result;
      }
    },
    representative: {
      type: UserType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args) {
        const result = await User.findOne({
          _id: args.id,
          active: true,
          userType: "Representative"
        });
        return result;
      }
    },
    representatives: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        const result = await User.find({
          active: true,
          userType: "Representative"
        });
        return result;
      }
    },
    authors: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        let area = await User.findOne({ _id: args.id });
        area = area.areaId;

        const result = await User.find({
          active: true,
          userType: "Author",
          areaId: area
        });
        return result;
      }
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        const result = await User.find({ active: true });
        return result;
      }
    },
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const result = await Book.findOne({ _id: args.id });
        return result;
      }
    },
    areaByRepresentativeId: {
      type: AreaType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const representative = await User.findOne({ _id: args.id });
        if (representative) {
          const result = await Area.findOne({ _id: representative.areaId });
          return result;
        } else {
          return null;
        }
      }
    },
    booksByAreaId: {
      type: new GraphQLList(BookType),
      args: { userId: { type: GraphQLID }, userType: { type: GraphQLString } },
      async resolve(parent, args) {
        if (args.userType === "Representative") {
          let areaId = await User.findOne({ _id: args.userId });
          areaId = areaId.areaId;
          const result = await Book.find({ areaId: areaId });
          return result;
        } else if (args.userType === "Author") {
          const result = await Book.find({ authorId: args.userId });
          return result;
        } else {
          return null;
        }
      }
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        const result = await Book.find({});
        return result;
      }
    },
    requests: {
      type: new GraphQLList(RequestType),
      args: { userId: { type: GraphQLID } },
      async resolve(parent, args) {
        const user = User.findOne({ _id: args.userId });
        let result = null;
        if (user.userType === "Coordinator") {
          result = await Request.find({});
        } else if (user.userType === "Representative") {
          result = await Request.find({ areaId: user.areaId });
        } else {
          result = await Request.find({ authorId: args.authorId });
        }
        return result;
      }
    },
    files: {
      type: new GraphQLList(FileType),
      async resolve(parent, args) {
        const result = await File.find({});
        return result;
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addFile: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        base64: { type: new GraphQLNonNull(GraphQLString) },
        typeOfFile: { type: new GraphQLNonNull(GraphQLString) },
        ISBN: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        try {
          let url = isBase64(args.base64)
            ? await saveFile(args.bookId.toString(), args.name, args.base64)
            : args.base64;

          const query = { _id: args.bookId };
          let newValues = null;

          if (args.typeOfFile === "Libro con nombres") {
            newValues = {
              fileWithNames: url
            };
          } else if (args.typeOfFile === "Libro sin nombres") {
            newValues = {
              fileWithoutNames: url
            };
          } else if (args.typeOfFile === "Dictamen 1") {
            newValues = {
              dictamenOne: url
            };
          } else if (args.typeOfFile === "Dictamen 2") {
            newValues = {
              dictamenTwo: url
            };
          } else if (args.typeOfFile === "Dictamen 3") {
            newValues = {
              dictamenThree: url
            };
          } else if (args.typeOfFile === "Libro corregido") {
            newValues = {
              correctedBook: url
            };
          } else if (args.typeOfFile === "Libro con ISBN") {
            newValues = {
              fileISBN: url,
              ISBN: args.ISBN
            };
          } else if (args.typeOfFile === "Libro aceptado") {
            newValues = {
              acceptedBook: url
            };
          } else if (args.typeOfFile === "Libro armado") {
            newValues = {
              armado: url
            };
          } else if (args.typeOfFile === "Libro listo") {
            newValues = {
              ready: url
            };
          } else if (args.typeOfFile === "Agradecimiento 1") {
            newValues = {
              agradecimiento1: url
            };
          } else if (args.typeOfFile === "Agradecimiento 2") {
            newValues = {
              agradecimiento2: url
            };
          } else if (args.typeOfFile === "Agradecimiento 3") {
            newValues = {
              agradecimiento3: url
            };
          }

          const options = { new: true };

          let result = null;
          await Book.findOneAndUpdate(query, newValues, options, function(
            err,
            doc
          ) {
            result = doc;
          });
          return result;
        } catch (error) {
          console.log(error);
        }
      }
    },
    addFirstFiles: {
      type: BookType,
      args: {
        bookName: { type: new GraphQLNonNull(GraphQLString) },
        base64: { type: new GraphQLNonNull(GraphQLString) },
        typeOfFile: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        try {
          const book = await Book.findOne({ name: args.bookName.trim() });
          if (book) {
            let myName = null;
            if (args.typeOfFile === "Libro con nombres") {
              myName = book.name + " - Libro con nombres";
            } else {
              myName = book.name + " - Libro sin nombres";
            }

            let url = isBase64(args.base64)
              ? await saveFile(book._id.toString(), myName, args.base64)
              : args.base64;

            const query = { _id: book._id };

            let newValues = null;

            if (args.typeOfFile === "Libro con nombres") {
              newValues = {
                fileWithNames: url
              };
            } else if (args.typeOfFile === "Libro sin nombres") {
              newValues = {
                fileWithoutNames: url
              };
            }
            const options = { new: true };

            let result = null;
            await Book.findOneAndUpdate(query, newValues, options, function(
              err,
              doc
            ) {
              result = doc;
            });
            return result;
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        areaId: { type: GraphQLID },
        email: { type: new GraphQLNonNull(GraphQLString) },
        userType: { type: new GraphQLNonNull(GraphQLString) },
        recordUserId: { type: GraphQLID }
      },
      async resolve(parent, args) {
        let user = new User({
          firstName: args.firstName,
          lastName: args.lastName,
          areaId: args.areaId ? args.areaId : "",
          email: args.email,
          userType: args.userType
        });

        const validation = await User.findOne({
          email: user.email,
          active: true
        });

        if (validation) {
          return null;
        } else {
          user.password = "Edit" + user.email.substring(0, 4);
          user.active = true;
          const result = await user.save();
          sendEmail(result);
          if (args.recordUserId) {
            if (user.userType === "Representative") {
              createRecord(args.recordUserId, "Creó un representante");
            } else if (user.userType === "Author") {
              createRecord(args.recordUserId, "Creó un autor");
            }
          }
          return result;
        }
      }
    },
    getBooksForSearch: {
      type: new GraphQLList(BookType),
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        try {
          let user = await User.findOne({ _id: args.userId });
          if (user) {
            let books = null;
            switch (user.userType) {
              case "Coordinator":
                books = await Book.find({});
                return books;
              case "Author":
                books = await Book.find({ authorId: user._id });
                return books;
              case "Representative":
                books = await Book.find({ areaId: user.areaId });
                return books;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    getUserByEmailAndPassword: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        try {
          const result = await User.findOne({
            email: args.email,
            password: args.password,
            active: true
          });
          createRecord(result._id, "Inició sesión");
          return result;
        } catch (error) {
          console.log(error);
        }
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        areaId: { type: GraphQLID },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const query = { _id: args.id };
        const newValues = {
          firstName: args.firstName,
          lastName: args.lastName,
          areaId: args.areaId ? args.areaId : "",
          email: args.email,
          password: args.password
        };
        const options = { new: true };
        let result = null;
        await User.findOneAndUpdate(query, newValues, options, function(
          err,
          doc
        ) {
          result = doc;
        });
        return result;
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        const query = { _id: args.id };
        const newValues = {
          active: false
        };
        const options = { new: true };
        let result = null;
        await User.findOneAndUpdate(query, newValues, options, function(
          err,
          doc
        ) {
          result = doc;
        });
        return result;
      }
    },
    addArea: {
      type: AreaType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        let area = new Area({
          name: args.name
        });
        const result = await area.save();
        return result;
      }
    },
    updateArea: {
      type: AreaType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const query = { _id: args.id };
        const newValues = {
          name: args.name
        };
        const options = { new: true };
        let result = null;
        await Area.findOneAndUpdate(query, newValues, options, function(
          err,
          doc
        ) {
          result = doc;
        });
        return result;
      }
    },
    deleteArea: {
      type: AreaType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        const result = await Area.findByIdAndRemove(args.id);
        return result;
      }
    },
    addRequest: {
      type: RequestType,
      args: {
        areaId: { type: new GraphQLNonNull(GraphQLID) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
        bookName: { type: new GraphQLNonNull(GraphQLString) },
        justification: { type: new GraphQLNonNull(GraphQLString) },
        docenciaActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        docenciaPriority: { type: new GraphQLNonNull(GraphQLString) },
        docenciaJustification: { type: new GraphQLNonNull(GraphQLString) },
        docenciaKindOfText: { type: new GraphQLNonNull(GraphQLString) },
        researchActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        researchPriority: { type: new GraphQLNonNull(GraphQLString) },
        difusionActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        difusionPriority: { type: new GraphQLNonNull(GraphQLString) },
        myPublic: { type: new GraphQLNonNull(GraphQLString) },
        market: { type: new GraphQLNonNull(GraphQLString) },
        numberOfBooks: { type: new GraphQLNonNull(GraphQLString) },
        financing: { type: new GraphQLNonNull(GraphQLString) },
        autorization: { type: new GraphQLNonNull(GraphQLBoolean) }
      },
      async resolve(parent, args) {
        let request = new Request({
          areaId: args.areaId,
          authorId: args.authorId,
          bookName: args.bookName,
          justification: args.justification,
          docenciaActive: args.docenciaActive,
          docenciaPriority: args.docenciaPriority,
          docenciaJustification: args.docenciaJustification,
          docenciaKindOfText: args.docenciaKindOfText,
          researchActive: args.researchActive,
          researchPriority: args.researchPriority,
          difusionActive: args.difusionActive,
          difusionPriority: args.difusionPriority,
          myPublic: args.myPublic,
          market: args.market,
          numberOfBooks: args.numberOfBooks,
          financing: args.financing,
          autorization: args.autorization
        });
        const result = await request.save();
        let book = new Book({
          name: result.bookName,
          requestId: result._id,
          areaId: result.areaId,
          authorId: result.authorId,
          stateRepresentative: "Solicitado",
          stateCoordinator: "Sin ISBN"
        });
        const bookGenerated = await book.save();

        let dataForPdf = {
          areaName: "",
          authorName: "",
          bookName: result.bookName,
          justification: result.justification,
          docenciaActive: "",
          docenciaPriority: result.docenciaPriority,
          docenciaJustification: result.docenciaJustification,
          docenciaKindOfText: result.docenciaKindOfText,
          researchActive: "",
          researchPriority: result.researchPriority,
          difusionActive: "",
          difusionPriority: result.difusionPriority,
          myPublic: result.myPublic,
          market: result.market,
          numberOfBooks: result.numberOfBooks,
          financing: result.financing,
          autorization: "SI"
        };

        const myArea = await Area.findOne({ _id: result.areaId });
        const myAuthor = await User.findOne({ _id: result.authorId });

        dataForPdf.areaName = myArea.name;
        dataForPdf.authorName = myAuthor.firstName + " " + myAuthor.lastName;

        if (result.docenciaActive === true) {
          dataForPdf.docenciaActive = "SI";
        } else {
          dataForPdf.docenciaActive = "NO";
          dataForPdf.docenciaJustification = "";
          dataForPdf.docenciaKindOfText = "";
          dataForPdf.docenciaPriority = "";
        }

        if (result.researchActive === true) {
          dataForPdf.researchActive = "SI";
        } else {
          dataForPdf.researchActive = "NO";
          dataForPdf.researchPriority = "";
        }

        if (result.difusionActive === true) {
          dataForPdf.difusionActive = "SI";
        } else {
          dataForPdf.difusionActive = "NO";
          dataForPdf.difusionPriority = "";
        }

        await generatePdf(dataForPdf, bookGenerated._id);

        const query = { _id: bookGenerated._id };
        const newValues = {
          requestUrl:
            "/storage/" +
            bookGenerated._id.toString() +
            "/" +
            bookGenerated.name +
            " - Solicitud de Publicacion.pdf"
        };
        const options = { new: true };
        let updatedBook = null;
        await Book.findOneAndUpdate(query, newValues, options, function(
          err,
          doc
        ) {
          updatedBook = doc;
        });

        return result;
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        areaId: { type: new GraphQLNonNull(GraphQLID) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
        stateRepresentative: { type: new GraphQLNonNull(GraphQLString) },
        stateCoordinator: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        let book = new Book({
          name: args.name,
          areaId: args.areaId,
          authorId: args.authorId,
          stateRepresentative: args.stateRepresentative,
          stateCoordinator: args.stateCoordinator
        });
        const result = await book.save();
        const Request = { target: book._id, title: book.name };
        generatePdf(Request);
        return result;
      }
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        areaId: { type: new GraphQLNonNull(GraphQLID) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
        stateRepresentative: { type: new GraphQLNonNull(GraphQLString) },
        stateCoordinator: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const query = { _id: args.id };
        const newValues = {
          name: args.name,
          areaId: args.areaId,
          authorId: args.authorId,
          stateRepresentative: args.stateRepresentative,
          stateCoordinator: args.stateCoordinator
        };
        const options = { new: true };
        let result = null;
        await Book.findOneAndUpdate(query, newValues, options, function(
          err,
          doc
        ) {
          result = doc;
        });
        return result;
      }
    },
    deleteBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        const result = await Book.findByIdAndRemove(args.id);
        return result;
      }
    }
  }
});

async function createRecord(userId, action) {
  try {
    const date = new Date();
    const record = new Record({
      userId: userId,
      action: action,
      date:
        date.getDate().toString() +
        "/" +
        (date.getMonth() + 1).toString() +
        "/" +
        date.getFullYear().toString(),
      time:
        date.getHours().toString() +
        ":" +
        date.getMinutes().toString() +
        ":" +
        date.getSeconds().toString()
    });
    const result = await record.save();
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
