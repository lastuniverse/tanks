export class Cache {

    constructor() {
        this.list = {};
    }

    insert(name, data) {
        if (data === undefined) throw `Data for cache item '${name}' cannot be undefined.`;
        if (!name || typeof name !== 'string') throw `Name of cache item must be a non-empty string.`;
        if (this.list[name]) throw `Item name '${name}' is allready exists in cache.`;
        this.list[name] = data;
        return data;
    }

    delete(name) {
        const data = this.list[name];
        delete this.list[name];
        return data;
    }

    replace(name, data) {
        this.delete(name);
        this.insert(name, data);
        return data;
    }

    get(name) {
        return this.list[name];
    }
}
