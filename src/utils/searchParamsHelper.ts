export class SearchParamsHelper {
    private searchQuery: URLSearchParams;
    constructor(searchParams: URLSearchParams['entries']) {
        this.searchQuery = new URLSearchParams(Array.from(searchParams()));
    }

    get getParams() {
        return this.searchQuery;
    }

    set(name: string, value: string) {
        this.searchQuery.set(name, value);
    }

    delete(name: string) {
        this.searchQuery.delete(name);
    }
}
