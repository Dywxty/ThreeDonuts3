document.addEventListener('DOMContentLoaded', () => {
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

  // Compra dos cards
  document.querySelectorAll('.card').forEach((card) => {
    const buyBtn = card.querySelector('button');
    if (!buyBtn) return;
    buyBtn.addEventListener('click', () => {
      const priceEl = card.querySelector('strong, .price');
      const priceText = priceEl ? priceEl.textContent : '';
      // Extrai número de BRL (ex.: "R$ 12,50")
      const numeric = priceText.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
      const price = parseFloat(numeric) || 0;
      total += price;
      if (totalElement) totalElement.textContent = `Total: ${fmtBRL(total)}`;
    });
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
      if (total > 0) {
        const resumo = metodoPagamento ? `\nForma: ${metodoPagamento}` : '';
        alert(`Obrigado pela compra!${resumo}\nTotal: ${fmtBRL(total)}`);
        total = 0;
        metodoPagamento = null;
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