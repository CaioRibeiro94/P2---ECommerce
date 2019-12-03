//Variaveis Global
let cart = [];
let modalQt = 1; 
let modalKey = 0;

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

//Listagem das jogos

jogoJson.map((item, index) => {
  let jogoItem = select('.models .jogo-item').cloneNode(true);

  jogoItem.setAttribute('data-key', index);
  jogoItem.querySelector('.jogo-item--img img').src = item.img;
  jogoItem.querySelector('.jogo-item--name').innerHTML = item.name;
  jogoItem.querySelector('.jogo-item--desc').innerHTML = item.description;
  jogoItem.querySelector('.jogo-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

  jogoItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    let key = e.target.closest('.jogo-item').getAttribute('data-key');
    modalQt = 1; 
    modalKey = key;

    select('.jogoBig img').src = jogoJson[key].img;
    select('.jogoInfo h1').innerHTML = jogoJson[key].name;
    select('.jogoInfo--desc').innerHTML = jogoJson[key].description;
    select('.jogoInfo--actualPrice').innerHTML = `R$ ${jogoJson[key].price.toFixed(2)}`;
    select('.jogoInfo--size.selected').classList.remove('selected');
    selectAll('.jogoInfo--size').forEach((size, sizeIndex) => {
      if(sizeIndex == 2) {
        size.classList.add('selected');
      }

      size.querySelector('span').innerHTML = jogoJson[key].sizes[sizeIndex];
    });

    select('.jogoInfo--qt').innerHTML = modalQt;

    select('.jogoWindowArea').style.display = 'flex';
    setTimeout(() => {
      select('.jogoWindowArea').style.opacity = 1;
    }, 200);

  });
  
  select('.jogo-area').append( jogoItem );
});

// Eventos do MODAL

function closeModal() {

  select('.jogoWindowArea').style.opacity = 0;
  setTimeout(() => {
    select('.jogoWindowArea').style.display = 'none';
  }, 200);

}
//Fecha Modal
selectAll('.jogoInfo--cancelButton, .jogoInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click', closeModal);
})
//Adiciona qtd
select('.jogoInfo--qtmenos').addEventListener('click', () => {
  if(modalQt > 1) {
    modalQt--;

    let actualPrice = parseFloat(select('.jogoInfo--actualPrice').innerHTML.replace('R$', '').trim());

    select('.jogoInfo--actualPrice').innerHTML = `R$ ${(actualPrice-jogoJson[modalKey].price).toFixed(2)}`;
    select('.jogoInfo--qt').innerHTML = modalQt;
  }
});

select('.jogoInfo--qtmais').addEventListener('click', () => {
  modalQt++;
  select('.jogoInfo--actualPrice').innerHTML = `R$ ${(jogoJson[modalKey].price*modalQt).toFixed(2)}`;
  select('.jogoInfo--qt').innerHTML = modalQt;
});

selectAll('.jogoInfo--size').forEach((size) => {
  size.addEventListener('click', () => {
    select('.jogoInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

select('.jogoInfo--addButton').addEventListener('click', () => {
  let size = parseInt(select('.jogoInfo--size.selected').getAttribute('data-key'));
  let identifier = jogoJson[modalKey].id+'@'+size;
  let key = cart.findIndex((item) => item.identifier === identifier);

  if(key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: jogoJson[modalKey].id,
      size,
      qt: modalQt
    });
  }

  updateCart();
  closeModal();
});
//Abre menu
select('.menu-openner').addEventListener('click', () => {
  if(cart.length > 0) {
    select('aside').style.left = '0';
  } 
});
//Fecha Menu
select('.menu-closer').addEventListener('click', () => {
  select('aside').style.left = '100vw';
});
//Atualizacoes no carrinho
function updateCart() {
  select('.menu-openner span').innerHTML = cart.length;

  if(cart.length > 0) {
    select('aside').classList.add('show');
    select('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for(let i in cart) {
      let jogoItem = jogoJson.find((item) => item.id === cart[i].id);
      subtotal += jogoItem.price * cart[i].qt;

      let cartItem = select('.models .cart--item').cloneNode(true);

      let jogoSizeName;
      switch(cart[i].size) {
        case 0:
          jogoSizeName = 'Newbie';
          break;
        case 1: 
          jogoSizeName = 'Medium';
          break;
        case 2:
          jogoSizeName = 'Boss';
          break;
      }

      let jogoName = `${jogoItem.name} (${jogoSizeName})`;

      cartItem.querySelector('img').src = jogoItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = jogoName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if(cart[i].qt > 1) {
          cart[i].qt--;
        } else {
          cart.splice(i, 1);
        }
        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qt++;
        updateCart();
      });
      
      select('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    select('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    select('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    select('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


  } else {
    select('aside').classList.remove('show');
    select('aside').style.left = '100vw';
  }
}

//cart--area

function teste()
{
 alert("Sua compra foi aprovada no valor total de =")
}