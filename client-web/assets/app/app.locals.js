/*@ngInject*/
module.exports = function translateConfig($translateProvider) {
    $translateProvider
        .useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        })
        .registerAvailableLanguageKeys(['en', 'fr'], {
            'en_*': 'en',
            'fr_*': 'fr'
        })
        // .determinePreferredLanguage()
        .preferredLanguage('en')
        // .fallbackLanguage('en')
        .useSanitizeValueStrategy('escape');
};