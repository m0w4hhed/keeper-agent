export interface Invoice {
    active: boolean;         // default: true
    pemesan: string;
    id: string;
    kodeUnik: number;
    berat: number;          // gram
    cs: string;
    dicek: boolean;
    deposit: number;
    hutang: number;
    diskon: number;
    ekspedisi: Ekspedisi;
    penerima: Penerima;
    pengirim: Pengirim;
    pesanan: Pesanan[];
    status: string;         // keep, dibayar, dikirim
    total: number;
    waktuDibayar: number;
    waktuOrder: number;
    waktuDicek: number;
    resi: string;
    printed: boolean;
    bank: string;
}
export interface Penerima {
    alamat: string;
    hp: number;
    kab: string;
    kec: string;
    nama: string;
    prov: string;
}
export interface Pengirim {
    hp: number;
    nama: string;
}
export interface Pesanan {
    barcode: string;
    berat: number;
    hargaBeli: number;
    hargaJual: number;
    nama: string;
    toko: string;
    warna: string;
    statusKeep: string;     // (fullkeep/diambil/kosong)
    dateKeep: number;
    printed: boolean;
    tglPrint: number;
}
export interface Ekspedisi {
    kurir: string;
    ongkir: number;
    realOngkir: number;
    service: string;
}

export interface Ambilan {
    barang: string;         // nama
    barcode: string;
    cs: string;
    dateKeep: number;
    hargaBeli: number;
    penerima: string;
    pj: string;                 // gudang
    statusKeep: string;         // (fullkeep/diambil/kosong)
    toko: string;
    warna: string;
    wktScan: number;
    printed: boolean;
    tglPrint: number;
}
