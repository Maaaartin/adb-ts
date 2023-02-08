module.exports = {
    readme: './README_DOCS.md',
    treatWarningsAsErrors: true,
    excludeExternals: true,
    externalPattern: '**/node_modules/**',
    out: './docs',
    entryPoints: 'src/indexDocs.ts',
    githubPages: true,
    name: 'adb-ts'
};
