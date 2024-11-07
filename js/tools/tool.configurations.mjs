import comparePaths from './tool.compare.path.js';

const list = [];


/**
 * Добавляет объект с конфигурацией во внутреннее хранилище. Объект должен иметь свойство
 * name типа string содержащее наименование подключаемой конфигурации либо необходимо указать наименование напрямую.
 * Попытка загрузить несколько конфигураций с одинаковыми именами вызовет ошибку. порядок мледования аргументов - произвольный
 * @param {string} configName наименование конфигурации
 * @param {object} configData объект, содержащий конфигурационные данные
 * @param {boolean} isReplace если true, то при наличии запомненой конфигурации с именем configName не выдавать ошибку
 */
function add(...args) {

    // задаем значения по умолчанию
    let configName = 'default/empty',
        configData = {},
        isReplace = false;

    // разгребаем аргументы
    args.forEach(item => {
        if (typeof item === 'string') {
            configName = item
                .replace(/^[\\\/\.\-]+/, '')
                .replace(/[\\\/\.\-]+$/, '');
            return;
        }
        if (typeof item === 'object' && !Array.isArray(item)) {
            configData = { ...item };
            return;
        }
        if (typeof item === 'boolean') {
            isReplace = item;
            return;
        }
    }, this);


    // если в аргументах имя конфигурации задано не было а в конфиге было то берем его из конфига
    if (configName === 'default/empty' && typeof configData.configName === 'string' && configData.configName?.length > 0)
        configName = configData.configName
            .replace(/^[\\\/\.]+/, '')
            .replace(/[\\\/\.]+$/, '');


    // заменяем имя в конфиге (если оно не было указано в конфиге или было указано в параметрах)
    // configData.configName = configName;


    // ищем объект с таким имененм
    let index;
    list.some((item, i) => {
        if (item.configName !== configName) return false;
        index = i;
        return true;
    });


    if (index !== undefined) {
        // если объекта с таким имененм уже есть
        if (isReplace) {
            list[index] = configData;
        } else {
            throw 'Конфигурация для "' + configName + '" уже подключена, перепроверьте ваши данные';
        }
    } else {
        // если объекта с таким имененм нет 
        list.push(configData);
    }
    // console.log('[config]', configName, configData.configName);
}


/**
 * Удаляет переданную конфигурацию из внутреннего хранилища загруженных конфигураций.
 * @param {string} configName
 */
function remove(configName) {
    if (typeof configName !== 'string' || !configName) return;

    let index;
    list.some((item, i) => {
        if (item.name !== configName) return false;
        index = i;
        return true;
    });

    if (index !== undefined) {
        list.splice(index, 1);
    }

    // if(this.getConfigByName(config.name)) throw 'Конфигурация для "'+config.name+'" уже подключена, перепроверьте ваши данные';
}

/**
 * Производит поиск объекта с конфигурационными данными с наименованием name во
 * внутреннем хранилище и возвращает его. При использовании шаблонов имени
 * содержащих символ `*` будет возвращен массив содержащий конфигурации, имя которых
 * сопоставляется с шаблоном
 * @param {string} configName наименование запрашиваемой конфигурации
 * 
 * @returns {object|array} объект с конфигурационными данными или null если объекта с именем name не найдено или массив с объектами.
 */
function getConfigurations(configName) {
    if (!configName || typeof configName !== 'string') return [];
    return list.filter(item => {
        return comparePaths(item.configName, configName);
    });
}

function getConfiguration(configName) {
    if (!configName || typeof configName !== 'string') return;
    return list.find(item => {
        return item.configName === configName;
    });

}




export default {
    add,
    remove,
    getConfigurations,
    getConfiguration
};

