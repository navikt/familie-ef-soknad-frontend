const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");

const getHtmlWithDecorator = (filePath) =>
    injectDecoratorServerSide({
        env: process.env.ENV,
        filePath: filePath});


module.exports = getHtmlWithDecorator;