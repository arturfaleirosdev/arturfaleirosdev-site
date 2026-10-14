// main.js — lógica do portfólio
// Edite as variáveis abaixo para personalizar o site
const username = 'arturfaleirosdev';
const selectedRepos = []; // Ex: ['meu-projeto-1','site-portfolio'] — deixe vazio para listar todos os repositórios públicos

// Dados iniciais de exemplo para skills e certificados
const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'];
const certificates = [
  {title: 'Exemplo: Curso de JavaScript', url: '#'},
];

// Preenche skills
const skillsList = document.getElementById('skillsList');
skills.forEach(s => {
  const li = document.createElement('li'); li.textContent = s; skillsList.appendChild(li);
});

// Preenche certificados
const certList = document.getElementById('certList');
certificates.forEach(c => {
  const li = document.createElement('li');
  const a = document.createElement('a'); a.href = c.url; a.textContent = c.title; a.target = '_blank';
  li.appendChild(a); certList.appendChild(li);
});

// Busca repositórios do GitHub e exibe
const projectsList = document.getElementById('projectsList');
async function loadRepos(){
  projectsList.textContent = 'Carregando...';
  try{
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if(!res.ok) throw new Error('Falha ao buscar repositórios');
    const repos = await res.json();
    let filtered = repos;
    if(Array.isArray(selectedRepos) && selectedRepos.length>0){
      filtered = repos.filter(r => selectedRepos.includes(r.name));
    }
    if(filtered.length===0){ projectsList.innerHTML = '<p>Nenhum repositório encontrado.</p>'; return }
    projectsList.innerHTML = '';
    filtered.forEach(r => {
      const div = document.createElement('div'); div.className = 'project';
      const title = document.createElement('h3');
      const a = document.createElement('a'); a.href = r.html_url; a.textContent = r.name; a.target = '_blank';
      title.appendChild(a);
      const p = document.createElement('p'); p.textContent = r.description || 'Sem descrição';
      const tags = document.createElement('div'); tags.style.marginTop='8px'; tags.style.fontSize='13px'; tags.style.color='var(--muted)';
      tags.textContent = `⭐ ${r.stargazers_count} • Atualizado em ${new Date(r.updated_at).toLocaleDateString()}`;
      div.appendChild(title); div.appendChild(p); div.appendChild(tags);
      projectsList.appendChild(div);
    })
  }catch(err){ projectsList.innerHTML = `<p>Erro: ${err.message}</p>` }
}
loadRepos();

// Carregamento dinâmico dos jogos
const loadTetrisBtn = document.getElementById('loadTetris');
const loadPongBtn = document.getElementById('loadPong');
const gameArea = document.getElementById('gameArea');

loadTetrisBtn.addEventListener('click', async () => {
  gameArea.innerHTML = '';
  const script = document.createElement('script'); script.src = '/games/tetris.js'; script.defer = true;
  gameArea.appendChild(document.createElement('div'));
  document.body.appendChild(script);
});

loadPongBtn.addEventListener('click', async () => {
  gameArea.innerHTML = '';
  const script = document.createElement('script'); script.src = '/games/pingpong.js'; script.defer = true;
  document.body.appendChild(script);
});

// Smooth scroll for nav links
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', e => {
  e.preventDefault(); document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
}));
