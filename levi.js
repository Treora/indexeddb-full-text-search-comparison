import levi from 'levi'

const lv = levi('db')
    .use(levi.tokenizer())
    .use(levi.stemmer())
    .use(levi.stopword())


async function init() {
    time('create index')
    for (let i=INDEX_START; i<Math.min(texts.length, INDEX_END); i++) {
        const id = `${i}`
        const text = texts[i]
        await lv.put(id, {
            id,
            text,
        })
        log(`${i+1} texts done..`)
    }
    timeEnd('create index')
}

async function testSearch() {
    time('searchAll')
    for (let i=0; i<testQueries.length; i++) {
        const q = testQueries[i]
        log(`Query: ${q}`)
        await search(q)
    }
    timeEnd('searchAll')
}

function searchP(q) {
    return new Promise(resolve =>
        lv.searchStream(q).toArray(resolve)
    )
}
function search(q) {
    time('search')
    return searchP(q).then(results => {
        timeEnd('search')
        results.forEach(result => {
            const text_nr = Number.parseInt(result.key)
            const t = texts[text_nr]
            log(`${result.score}: ${result.key}: ${t && t.trim().substring(0,50)}`)
        })
    })
}

window.levi = {
    index: () => init().catch(fail),
    testSearch: () => testSearch().catch(fail),
    search: q => (search(q), undefined)
}
