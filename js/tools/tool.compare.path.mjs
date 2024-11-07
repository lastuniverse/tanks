/**
 * Утилита для сопоставления путей и их простые шаблонов.
 * Пример ниже дает представление о возможностях использования данных шаблонов:
 * ```
 *  'aaa'       === 'aaa'
 *  'aaa'       !== 'bbb'
 *  'aaa.bbb'   === 'aaa.bbb'
 *  'aaa.bbb'   !== 'aaa.ccc'
 *  'aaa.*'     === 'aaa'
 *  'aaa.*'     === 'aaa.*'
 *  'aaa.*'     === 'aaa.bbb'
 *  'aaa.*.ccc' !== 'aaa'
 *  'aaa.*.ccc' === 'aaa.*'
 *  'aaa.*.ccc' !== 'aaa.bbb'
 *  'aaa.*.*'   === 'aaa.bbb'
 *  'aaa.*.ccc' === 'aaa.bbb.*'
 *  'aaa.*.ccc' === 'aaa.bbb.ccc'
 *  '*'         === 'aaa'
 *  '*'         === 'aaa.bbb'
 *  '*'         === 'aaa.bbb.ccc'
 * ```
 */


const re = /[\\\/\.]/;
// console.log('/aaa/bbb', '/aaa/bbb'.split(re));
// console.log('aaa/bbb', 'aaa/bbb'.split(re));
// console.log('.aaa.bbb', '.aaa.bbb'.split(re));
// console.log('aaa.bbb', 'aaa.bbb'.split(re));

/**
 * Функция сравнивает пути и шаблоны путей
 * @param {string} path1 or template
 * @param {string} path2 or template 
 * @returns {boolean} вернет true если совпадают, иначе false
 */
export default function comparePaths(pathName1, pathName2) {
    const path1 = Array.isArray(pathName1) ? pathName1 : pathName1.split(re);
    const len1 = path1.length;

    const path2 = Array.isArray(pathName2) ? pathName2 : pathName2.split(re);
    const len2 = path2.length;

    const len = Math.max(len1, len2);

    let isEqual = true;

    for (let i = 0; i < len; i++) {
        const key1 = path1[i];
        const key2 = path2[i];
        if (key1 === '*' && len1 === i + 1) break;
        if (key2 === '*' && len2 === i + 1) break;
        if (key1 === '*' || key2 === '*' || key1 === key2) continue;
        isEqual = false;
        break;
    }

    return isEqual;
}


// console.log('aaa', 'aaa',                       comparePaths('aaa', 'aaa')  );
// console.log('aaa', 'bbb',                       comparePaths('aaa', 'bbb')  );
// console.log('aaa.bbb', 'aaa.bbb',                       comparePaths('aaa.bbb', 'aaa.bbb')  );
// console.log('aaa.bbb', 'aaa.ccc',                       comparePaths('aaa.bbb', 'aaa.ccc')  );
// console.log('aaa.*', 'aaa',                     comparePaths('aaa.*', 'aaa')    );
// console.log('aaa.*', 'aaa.*',                       comparePaths('aaa.*', 'aaa.*')  );
// console.log('/aaa/*', 'aaa/bbb',                     comparePaths('aaa.*', 'aaa.bbb')    );
// console.log('aaa.*.ccc', 'aaa',                     comparePaths('aaa.*.ccc', 'aaa')    );
// console.log('aaa.*.ccc', 'aaa.*',                       comparePaths('aaa.*.ccc', 'aaa.*')  );
// console.log('aaa.*.ccc', 'aaa.bbb',                     comparePaths('aaa.*.ccc', 'aaa.bbb')    );
// console.log('aaa.*.*', 'aaa.bbb',                       comparePaths('aaa.*.*', 'aaa.bbb')  );
// console.log('aaa.*.ccc', 'aaa.bbb.*',                       comparePaths('aaa.*.ccc', 'aaa.bbb.*')  );
// console.log('aaa.*.ccc', 'aaa.bbb.ccc',                     comparePaths('aaa.*.ccc', 'aaa.bbb.ccc')    );
// console.log('*', 'aaa',                     comparePaths('*', 'aaa')    );
// console.log('*', 'aaa.bbb',                     comparePaths('*', 'aaa.bbb')    );
// console.log('*', 'aaa.bbb.ccc',                     comparePaths('*', 'aaa.bbb.ccc')    );
















