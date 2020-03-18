
export interface Invoice {
    active: boolean;         // default: true
    pemesan: string;
    id: string;
    kodeUnik: number;
    berat: number;          // gram
    bank: string;
    cs: string;
    dicek: boolean;
    deposit: number;
    hutang: number;
    diskon: number;
    ekspedisi: Ekspedisi;
    penerima: Penerima;
    pengirim: Pengirim;
    pesanan: Pesanan[];
    realBerat: number;
    realOngkir: number;
    status: string;         // keep, dibayar, dikirim
    subtotal: number;
    total: number;
    waktuDibayar: number;
    waktuOrder: number;
    waktuDicek: number;
    waktuDikirim: number;
    resi: string;
    printed: boolean;
}

export interface Pesanan {
    barang: string;
    barcode: string;
    berat: number;
    cs: string;
    dateKeep: number;
    hargaBeli: number;
    hargaJual: number;
    img: string;
    penerima: string;
    pj: string;
    printed: boolean;
    statusKeep: string;     // (fullkeep/diambil/kosong)
    waktuPrint: number;     // unix timestamp
    toko: string;
    warna: string;
    wktScan: number;
}

export interface Pengirim {
    hp: number;
    nama: string;
}

export interface Penerima {
    alamat: string;
    hp: number;
    kab: string;
    kec: string;
    kec_id: string;
    nama: string;
    prov: string;
}

export interface Ekspedisi {
    kurir: string;
    ongkir: number;
    service: string;
}

export interface UserConfig {
    cors_proxy: string;
    data_berat: {}[];
    data_toko: string[];
    data_toko_blacklist: string[];
    graphqlAPI: string;
    key: string;
    tele_reg: string;
    wa_admin: number;
    wa_cs: number;
    wa_keeper: number;
}
export interface DataToko {
    active: boolean;
    blok: string;
    foto: string;
    hpDaftar: number;
    hpKeep: number;
    jual: string[];
    kode: string;
    lantai: number;
    nama: string;
    no: string;
}
