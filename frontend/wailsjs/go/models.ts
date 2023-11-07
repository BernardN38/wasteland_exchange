export namespace entities {
	
	export class Good {
	    name: string;
	    baseValue: number;
	
	    static createFrom(source: any = {}) {
	        return new Good(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.baseValue = source["baseValue"];
	    }
	}
	export class MarketGood {
	    // Go type: Good
	    good: any;
	    currentPrice: number;
	    quantityAvailable: number;
	    demand: number;
	
	    static createFrom(source: any = {}) {
	        return new MarketGood(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.good = this.convertValues(source["good"], null);
	        this.currentPrice = source["currentPrice"];
	        this.quantityAvailable = source["quantityAvailable"];
	        this.demand = source["demand"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MarketInventory {
	    goods: {[key: string]: MarketGood};
	    capacity: number;
	
	    static createFrom(source: any = {}) {
	        return new MarketInventory(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.goods = source["goods"];
	        this.capacity = source["capacity"];
	    }
	}
	export class Market {
	    marketName: string;
	    inventory: MarketInventory;
	
	    static createFrom(source: any = {}) {
	        return new Market(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.marketName = source["marketName"];
	        this.inventory = this.convertValues(source["inventory"], MarketInventory);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

