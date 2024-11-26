document.addEventListener("alpine:init", () => {
    Alpine.data("products", () => ({
        items: [
            { id: 1, name: "Rogusta Brazil", img: "1.jpg", price: 20000 },
            { id: 2, name: "Arabica Blend", img: "2.jpg", price: 25000 },
            { id: 3, name: "Primo Passo", img: "3.jpg", price: 30000 },
            { id: 4, name: "Aceh Gayo", img: "4.jpg", price: 35000 },
            { id: 5, name: "Java of decca", img: "5.jpg", price: 40000 },
        ],
    }));

    Alpine.store("cart", {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // Cek apakah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada / cart masih kosong
            if (!cartItem) {
                this.items.push({...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.item = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {} else {
                        // jika barang sudah ada, tambah quantity dan totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return;
                    }
                });
            }
        },
        remove(id) {
            // ambil item yang mau diremove berdasarkan id nya
            const cartItem = this.items.find((item) => item.id === id);

            // jika item lebih dari 1
            if (cartItem.quantity > 1) {
                // telusuri 1 1
                this.items = this.items.map((item) => {
                    // jika bukan barang yang diklik
                    if (item.id !== id) {} else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                // jika barangnya sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        },
    });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function() {
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove("disabled");
            checkoutButton.classList.add("disabled");
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove("disabled");
});

// Menambahkan event listener pada tombol checkout
checkoutButton.addEventListener("click", function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open("http://wa.me/6281210812631?text=" + encodeURI(message));
});

// format pesan whatsapp
const formatMessage = (obj) => {
        return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
    ${JSON.parse(obj.items).map(
      (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
    )}
TOTAL: ${rupiah(obj.total)}
Terima Kasih.;`;
};

// Fungsi untuk mengonversi angka ke format mata uang Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};