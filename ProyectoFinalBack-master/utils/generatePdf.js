var pdf = require("html-pdf");

module.exports = function(Request, target) {
  const date = new Date();
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();
  const myDate = day + "/" + month + "/" + year;

  var contenido =
    '<div style="width: 100%; display: flex; justify-content: center;">' +
    '<div style="width: 100%;">' +
    '<div style="font-weight: bold; font-size: 22px;">' +
    "SOLICITUD DE PUBLICACIÓN" +
    "</div>" +
    '<div style="margin-top: 20px; font-size: 22px">' +
    "COMITÉ EDITORIAL DE LA FACULTAD DE CIENCIAS" +
    "</div>" +
    '<div style="font-size: 20px">' +
    "Presente" +
    "</div>" +
    '<div style="margin-top: 20px; font-size: 22px">' +
    "Área: " +
    Request.areaName +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "Por este conducto someto (sometemos) a consideración la obra " +
    Request.bookName +
    " para ser publicada por esta Facultad." +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "A continuación presento la justificación y argumentación para la publicación de la obra:" +
    "</div>" +
    '<div style="font-size: 20px; text-align: justify">' +
    Request.justification +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "Por lo que su finalidad es:" +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "a) La docencia (" +
    Request.docenciaActive +
    ")" +
    " (" +
    Request.docenciaPriority +
    ")" +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "Tipo de texto (docencia): " +
    Request.docenciaKindOfText +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "A qué programa(s)  y asignatura(s) apoyará la propuesta (docencia): " +
    Request.docenciaJustification +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "b) La investigación (" +
    Request.researchActive +
    ")" +
    " (" +
    Request.researchPriority +
    ")" +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "c) La difusión (" +
    Request.difusionActive +
    ")" +
    " (" +
    Request.difusionPriority +
    ")" +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "El público al que va dirigido es: " +
    Request.myPublic +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">' +
    "El mercado potencial es de (cuántos grupos, alumnos y/o instituciones) " +
    Request.market +
    ", por lo que se propone un tiraje de " +
    Request.numberOfBooks +
    " ejemplares.</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">Financiamiento: ' +
    Request.financing +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">Autorizo que mis datos sean usados: ' +
    Request.autorization +
    "</div>" +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">Declaro que el manuscrito propuesto no se encuentra sometido a consideración de otra institución o editorial para su publicación, y que no ha sido publicado por ningún otro medio incluyendo publicaciones electrónicas o base de datos de naturaleza pública.</div>' +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">Si el material no está completo o presenta deficiencias gramaticales o de lenguaje aceptaré que se me devuelva para su reescritura antes de ser enviado a los revisores o antes de ser aceptado.</div>' +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">Para tal efecto entrego la obra en original y dos copias impresas.</div>' +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">Atentamente</div>' +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">Fecha</div>' +
    myDate +
    '<div style="font-size: 20px; margin-top: 20px; text-align: justify">Autor: ' +
    Request.authorName +
    "</div>";
  "</div>" + "</div>";
  var options = {
    format: "A4",
    header: {
      height: "60px",
      contents:
        '<div style="text-align: center;">' + Request.bookName + "</div>"
    },
    footer: {
      height: "60px",
      contents: {
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>'
      }
    }
  };
  pdf
    .create(contenido, options)
    .toFile(
      "./storage/" +
        target.toString() +
        "/" +
        Request.bookName +
        " - Solicitud de Publicacion.pdf",
      function(err, res) {
        if (err) {
          console.log(err);
        } else {
        }
      }
    );
};
