const searchInput = document.querySelector("#search-input");
const auraContainer = document.querySelector("#aura-container");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const errorMessage = document.querySelector("#error-message");
const gridContainer = document.querySelector("#grid-container");

let allAnimeData = [];
let activeAura = "all";

const getAnimeData = async () => {
    try {
        loadingState.classList.remove("hidden");
        errorState.classList.add("hidden");
        gridContainer.classList.add("hidden");

        const response = await fetch("https://api.tenrai.org/v1/top/anime?limit=12", { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari server (Status HTTP: ${response.status})`);
        }

        const result = await response.json();

        allAnimeData = result.data.map((anime) => {
            return {
                title: anime.title,
                imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "",
                score: anime.score || 8.0,
                genres: anime.genres ? anime.genres.map((g) => g.name) : [],
                episodes: anime.episodes ? `${anime.episodes} Ep` : "Ongoing",
                url: anime.url
            };
        });

        loadingState.classList.add("hidden");
        gridContainer.classList.remove("hidden");
        filterAndRender();

    } catch (error) {
        loadingState.classList.add("hidden");
        errorState.classList.remove("hidden");
        errorMessage.textContent = error.message || "Gagal terhubung ke Tenrai API.";
    }
};

const renderCards = (animeList) => {
    if (animeList.length === 0) {
        gridContainer.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-400">
        <p class="text-lg font-semibold">Anime tidak ditemukan 🔍</p>
        <p class="text-xs text-slate-500 mt-1">Coba kata kunci atau pilih Vibe yang lain.</p>
      </div>
    `;
        return;
    }

    const cardsHTML = animeList
        .map((anime) => {
            const { title, imageUrl, score, genres, episodes, url } = anime;

            const genreText = genres.length > 0 ? genres.slice(0, 2).join(", ") : "Anime";
            const displayScore = score || "N/A";

            return `
        <div class="bg-venom-card border border-slate-800 hover:border-venom-green/50 rounded-2xl overflow-hidden transition duration-300 group shadow-lg flex flex-col justify-between">
          <div>
            <div class="relative aspect-[3/4] overflow-hidden">
              <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy">
              <span class="absolute top-3 left-3 bg-venom-green text-black font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                ★ ${displayScore}
              </span>
            </div>

            <div class="p-4 space-y-2">
              <h3 class="font-bold text-white group-hover:text-venom-green transition text-base line-clamp-1">${title}</h3>
              <p class="text-xs text-slate-400">${genreText} • ${episodes}</p>
            </div>
          </div>

          <div class="p-4 pt-0">
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="block text-center border border-venom-green/30 text-venom-green hover:bg-venom-green hover:text-black font-semibold text-xs py-2 rounded-xl transition duration-300">
              Lihat di MyAnimeList &rarr;
            </a>
          </div>
        </div>
      `;
        })
        .join("");

    gridContainer.innerHTML = cardsHTML;
};

const filterAndRender = () => {
    const keyword = searchInput.value.toLowerCase().trim();

    const filteredAnime = allAnimeData.filter((anime) => {
        const matchesTitle = anime.title.toLowerCase().includes(keyword);

        let matchesAura = true;
        if (activeAura === "high-energy") {
            matchesAura = anime.genres.some((g) => g.toLowerCase() === "action");
        } else if (activeAura === "melancholy") {
            matchesAura = anime.genres.some((g) => g.toLowerCase() === "drama");
        } else if (activeAura === "binge-mode") {
            matchesAura = anime.score && anime.score >= 8.5;
        }

        return matchesTitle && matchesAura;
    });

    renderCards(filteredAnime);
};

searchInput.addEventListener("input", filterAndRender);

auraContainer.addEventListener("click", (event) => {
    const targetBtn = event.target.closest(".aura-btn");
    if (!targetBtn) return;

    const buttons = auraContainer.querySelectorAll(".aura-btn");
    buttons.forEach((btn) => {
        btn.classList.remove("bg-venom-green", "text-black", "shadow-[0_0_10px_rgba(34,197,94,0.4)]", "active");
        btn.classList.add("bg-venom-card", "text-slate-300");
    });

    targetBtn.classList.remove("bg-venom-card", "text-slate-300");
    targetBtn.classList.add("bg-venom-green", "text-black", "shadow-[0_0_10px_rgba(34,197,94,0.4)]", "active");

    activeAura = targetBtn.dataset.aura;
    filterAndRender();
});

getAnimeData();