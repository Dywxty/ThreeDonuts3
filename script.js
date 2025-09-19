document.addEventListener('DOMContentLoaded', () => {
  // Controle de formulário de entrega obrigatório
  let entregaLiberada = false;
  const formEntrega = document.getElementById('form-entrega');
  const entregaStatus = document.getElementById('entrega-status');
  if (formEntrega) {
    formEntrega.addEventListener('submit', function(e) {
      e.preventDefault();
      const dados = new FormData(formEntrega);
      let ok = true;
      for (let [k, v] of dados.entries()) {
        if (!v || v.trim() === '') ok = false;
      }
      if (!ok) {
        if (entregaStatus) entregaStatus.textContent = 'Preencha todos os campos corretamente!';
        entregaLiberada = false;
        return;
      }
      entregaLiberada = true;
      if (entregaStatus) entregaStatus.textContent = '';
      alert('Dados de entrega confirmados! Agora você pode finalizar sua compra.');
    });
  }
  //  Utilidades 
  const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  //  Ano no rodapé 
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  //  Menu mobile 
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const opened = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!opened));
      mobileNav.hidden = opened;
      toggle.textContent = opened ? '☰' : '✕';
    });
  }

  // Rolagem suave para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  //  Formulário de contato 
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !message) {
        if (status) {
          status.textContent = 'Preencha todos os campos.';
          status.style.color = 'crimson';
        }
        return;
      }

      if (status) {
        status.textContent = 'Enviando...';
        status.style.color = '';
      }

      setTimeout(() => {
        if (status) {
          status.textContent = 'Mensagem enviada com sucesso! 🍩';
          status.style.color = 'green';
        }
        form.reset();
      }, 900);
    });
  }

  //  Carrinho de compras
  let total = 0;
  let metodoPagamento = null;
  const totalElement = document.getElementById('total-carrinho');
  const listaPedidos = document.getElementById('lista-pedidos');
  let pedidos = [];

  // Compra dos cards
  document.querySelectorAll('.card').forEach((card) => {
    const buyBtn = card.querySelector('button');
    if (!buyBtn) return;
    buyBtn.addEventListener('click', () => {
      const priceEl = card.querySelector('strong, .price');
      const priceText = priceEl ? priceEl.textContent : '';
      const nameEl = card.querySelector('h3');
      const nome = nameEl ? nameEl.textContent : 'Donut';
      // Extrai número de BRL (ex.: "R$ 12,50")
      const numeric = priceText.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
      const price = parseFloat(numeric) || 0;
      pedidos.push({ nome, price });
      total += price;
      atualizarListaPedidos();
    });
  function atualizarListaPedidos() {
    if (!listaPedidos) return;
    listaPedidos.innerHTML = '';
    pedidos.forEach((item, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.nome} - ${fmtBRL(item.price)}</span> <button class="btn-remover" title="Remover item" data-idx="${idx}">🗑️</button>`;
      listaPedidos.appendChild(li);
    });
    if (totalElement) totalElement.textContent = `Total: ${fmtBRL(total)}`;
    // Adiciona evento aos botões de remover
    listaPedidos.querySelectorAll('.btn-remover').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (!isNaN(idx)) {
          total -= pedidos[idx].price;
          pedidos.splice(idx, 1);
          atualizarListaPedidos();
        }
      });
    });
  }
  });

  // Seleção de forma de pagamento
  const pagamentoBtns = document.querySelectorAll('.btn-pagamento');
  pagamentoBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pagamentoBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      metodoPagamento = btn.textContent.trim();
      alert(`Forma de pagamento selecionada: ${metodoPagamento}`);
    });
  });

  // Botão pagar
  const pagarBtn = document.getElementById('btn-pagar');
  if (pagarBtn) {
    pagarBtn.addEventListener('click', () => {
      if (!entregaLiberada) {
        alert('Preencha o formulário de entrega para finalizar a compra!');
        if (formEntrega) formEntrega.scrollIntoView({behavior:'smooth'});
        return;
      }
      if (total > 0 && pedidos.length > 0) {
        const resumo = metodoPagamento ? `\nForma: ${metodoPagamento}` : '';
        let lista = pedidos.map(p => `- ${p.nome}: ${fmtBRL(p.price)}`).join('\n');
        alert(`Obrigado pela compra!${resumo}\nItens:\n${lista}\nTotal: ${fmtBRL(total)}`);
        total = 0;
        metodoPagamento = null;
        pedidos = [];
        atualizarListaPedidos();
        if (totalElement) totalElement.textContent = `Total: ${fmtBRL(0)}`;
        pagamentoBtns.forEach((b) => b.classList.remove('selected'));
      } else {
        alert('Seu carrinho está vazio!');
      }
    });
  }

  //  Donut girando no scroll
  const donut = document.getElementById('donut');
  if (donut) {
    let lastScrollY = window.scrollY;
    let rotation = 0;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      rotation += scrollDelta * 0.5;
      donut.style.transform = `rotate(${rotation}deg)`;
      lastScrollY = currentScrollY;
    });
  }
});

/*Login*/

function entrarLogin(login){
    if (login == '#entrar'){
    window.location.href = '#entrar'
}  
}