function renderProductos() {
  fetch("datos.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let html = "";
      for (const k of data) {
        html += `<div class="card" style="width: 20rem;">
      
            <div class="card-body">
              <h5 class="card-title">${k.nombre}</h5>
              <p>$ ${k.precio}</p> 
              <a href="#" id="${k.id}" class="btn btn-primary agregar-carrito" >Agregar al carrito</a>
            </div>
          </div>`;
      }
      document.getElementById("lista-productos").innerHTML = html;
    });
}
function buscarProducto() {
  let inputValue = document.getElementById("input").value;
  fetch("datos.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      const resultado = data.filter((x) => x.nombre === inputValue);
      let html = "";
      for (const k of resultado) {
        html += `<div class="card" style="width: 20rem;">
      
            <div class="card-body">
              <h5 class="card-title">${k.nombre}</h5>
              <p>$ ${k.precio}</p>
              <a href="#" id="${k.id}" class="btn btn-primary agregar-carrito" >Agregar al carrito</a>
            </div>
          </div>`;
      }
      document.getElementById("lista-productos").innerHTML = html;
    });
}

class Carrito {
  comprarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains("agregar-carrito")) {
      const producto = e.target.parentElement.parentElement;
      this.leerDatosProductos(producto);
    }
  }
  leerDatosProductos(producto) {
    const infoProducto = {
      nombre: producto.querySelector("h5").textContent,
      precio: producto.querySelector("p").textContent,
      id: producto.querySelector("a").getAttribute("id"),
      cantidad: 1,
    };
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Se agrego correctamente",
      showConfirmButton: false,
      timer: 1500,
    });
    this.insertarCarrito(infoProducto);
  }
  insertarCarrito(producto) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>
          <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
        </td>      
      `;
    listaProductos.appendChild(row);
    this.guardarProductosLocalStorage(producto);
  }
  eliminarProducto(e) {
    e.preventDefault();
    let producto, productoID;
    if (e.target.classList.contains("borrar-producto")) {
      e.target.parentElement.parentElement.remove();
      producto = e.target.parentElement.parentElement;
      productoID = producto.querySelector("a").getAttribute("data-id");
    }
    this.eliminarProductoLocalStorage(productoID);
  }
  vaciarCarrito(e) {
    e.preventDefault();
    while (listaProductos.firstChild) {
      listaProductos.removeChild(listaProductos.firstChild);
    }
    this.vaciarLocalStorage();
    return false;
  }

  guardarProductosLocalStorage(producto) {
    let productos;
    productos = this.obtenerProductosLocalStorage();
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));
  }

  obtenerProductosLocalStorage() {
    let productoLS;

    if (localStorage.getItem("productos") === null) {
      productoLS = [];
    } else {
      productoLS = JSON.parse(localStorage.getItem("productos"));
    }
    return productoLS;
  }

  eliminarProductoLocalStorage(productoID) {
    let productosLS;
    productosLS = this.obtenerProductosLocalStorage();
    productosLS.forEach(function (productoLS, index) {
      if (productoLS.id === productoID) {
        productosLS.splice(index, 1);
      }
    });
    localStorage.setItem("productos", JSON.stringify(productosLS));
  }

  leerLocalStorage() {
    let productoLS;
    productoLS = this.obtenerProductosLocalStorage();
    productoLS.forEach(function (producto) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>
          <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
        </td>      
      `;
      listaProductos.appendChild(row);
    });
  }

  vaciarLocalStorage() {
    localStorage.clear();
  }

  procesarPedido(e){
    e.preventDefault();
    location.href = "compra.html"
  }
}

renderProductos();
