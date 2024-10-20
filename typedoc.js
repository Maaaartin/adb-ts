module.exports = {
    readme: './README_DOCS.md',
    treatWarningsAsErrors: true,
    excludeExternals: true,
    externalPattern: '**/node_modules/**',
    excludePrivate: true,
    excludeProtected: true,
    out: './docs',
    entryPoints: 'src/indexDocs.d.ts',
    githubPages: true,
    name: 'adb-ts'
};
