module.exports = {
    readme: './README_NEW.md',
    treatWarningsAsErrors: true,
    excludeExternals: true,
    externalPattern: '**/node_modules/**',
    out: './docs',
    entryPoints: 'src/indexDocs.ts'
};
