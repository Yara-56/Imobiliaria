document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.querySelector('.menu-toggle');
    const submenuParents = document.querySelectorAll('.has-submenu');
  
    toggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      submenuParents.forEach(parent => {
        parent.classList.remove('open');
        const submenu = parent.querySelector('.submenu');
        const arrow = parent.querySelector('.arrow');
        if (submenu) submenu.style.display = 'none';
        if (arrow) arrow.classList.remove('rotated');
      });
    });
  
    submenuParents.forEach(parent => {
      const trigger = parent.querySelector('.menu-item');
      const submenu = parent.querySelector('.submenu');
      const arrow = parent.querySelector('.arrow');
      if (submenu) submenu.style.display = 'none';
  
      trigger.addEventListener('click', e => {
        e.preventDefault();
        const isOpen = parent.classList.contains('open');
  
        submenuParents.forEach(p => {
          p.classList.remove('open');
          p.querySelector('.submenu')?.style.setProperty('display', 'none');
          p.querySelector('.arrow')?.classList.remove('rotated');
        });
  
        if (!isOpen) {
          parent.classList.add('open');
          submenu.style.display = 'flex';
          arrow?.classList.add('rotated');
        }
      });
    });
  });
  