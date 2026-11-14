# hianime-api

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/bun-%23000000.svg?style=flat&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**A RESTful API that utilizes web scraping to fetch anime content from zanix.tr**

[Documentation](#documentation) • [Installation](#installation) • [API Endpoints](#api-endpoints) • [Development](#development)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Important Notice](#important-notice)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
- [Deployment](#deployment)
  - [Docker Deployment](#docker-deployment)
  - [Vercel Deployment](#vercel-deployment-serverless--recommended)
- [Video Integration](#video-integration)
- [Documentation](#documentation)
  - [Anime Home Page](#1-get-anime-home-page)
  - [Anime Schedule](#2-get-anime-schedule)
  - [Next Episode Schedule](#3-get-next-episode-schedule)
  - [Anime List Page](#4-get-anime-list-page)
  - [Anime Details](#5-get-anime-detailed-info)
  - [Search Results](#6-get-search-results)
  - [Search Suggestions](#7-get-search-suggestions)
  - [Filter Anime](#8-filter-anime)
  - [Filter Options](#9-get-filter-options)
  - [Anime Characters](#10-get-anime-characters)
  - [Character Details](#11-get-character-details)
  - [Anime Episodes](#12-get-anime-episodes)
  - [Episode Servers](#13-get-episode-servers)
  - [Top Search](#14-get-top-search)
  - [Anime Schedules](#17-get-anime-schedules-7-days)
  - [All Genres](#18-get-all-genres)
  - [Top Airing](#19-get-top-airing)
  - [Most Popular](#20-get-most-popular)
  - [Most Favorite](#21-get-most-favorite)
  - [Completed Anime](#22-get-completed-anime)
  - [Recently Added](#23-get-recently-added)
  - [Recently Updated](#24-get-recently-updated)
  - [Top Upcoming](#25-get-top-upcoming)
  - [Genre List](#26-get-anime-by-genre)
  - [Producer List](#27-get-anime-by-producer)
  - [Subbed Anime](#28-get-subbed-anime)
  - [Dubbed Anime](#29-get-dubbed-anime)
  - [Movies](#30-get-anime-movies)
  - [TV Series](#31-get-tv-series)
  - [OVA](#32-get-ova)
  - [ONA](#33-get-ona)
  - [Special](#34-get-special)
  - [Events](#35-get-events)
  - [Anime News](#37-get-anime-news)
  - [Anime News](#37-get-anime-news)
  - [Random Anime](#39-get-random-anime)
- [Development](#development)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

---

## Overview

hianime-api is a comprehensive RESTful API that provides endpoints to retrieve anime details, episodes, and streaming links by scraping content from zanix.tr. Built with modern web technologies, it offers a robust solution for anime content aggregation.

## Important Notice

> ![Disclaimer](https://img.shields.io/badge/Disclaimer-red?style=for-the-badge&logo=alert&logoColor=white)

1. This API is recommended for **personal use only**. Deploy your own instance and customize it as needed.

2. This API is just an **unofficial API for [zanix.tr](https://zanix.tr)** and is in no other way officially related to the same.

3. The content that this API provides is not mine, nor is it hosted by me. These belong to their respective owners. This API just demonstrates how to build an API that scrapes websites and uses their content.

---

## Video Integration

The `GET /api/v2/servers/:episodeId` endpoint returns ready-to-embed player `iframe` URLs for every available server, so you can drop them straight into an `<iframe>` — no URL building needed on your side. Get the `:episodeId` from `GET /api/v2/episodes/:id`.

```javascript
const eps = await fetch('/api/v2/episodes/one-piece-12').then(r => r.json());
const servers = await fetch(`/api/v2/servers/${eps.data[0].id}?type=sub`).then(r => r.json());
console.log(servers.data.servers[0].iframe);
```

For manual embedding, the players follow this format (same as the site builds itself):

**Embed Example URL:** `https://cdn.4animo.xyz/api/embed/hd-1/13825/sub?k=1&autoPlay=1&skipIntro=1&skipOutro=1`

**Usage Example:**

```html
<iframe src="https://cdn.4animo.xyz/api/embed/hd-1/13825/sub?k=1&autoPlay=1&skipIntro=1&skipOutro=1" width="100%" height="500" frameborder="0" allow="autoplay; fullscreen; picture-in-picture"> </iframe>
```

## Used By

This API is used by the following projects:

- **[ANIMO](https://4animo.xyz/)**: A comprehensive anime streaming platform that leverages this API for real-time anime data, schedules, and streaming links. Check it out to see the API in action!

---

## Installation

### Prerequisites

Make sure you have Bun.js installed on your system.

**Install Bun.js:**

```bash
https://bun.sh/docs/installation
```

### Local Setup

**Step 1:** Clone the repository

```bash
git clone https://github.com/ryanwtf7/hianime-api.git
```

**Step 2:** Navigate to the project directory

```bash
cd hianime-api
```

**Step 3:** Install dependencies

```bash
bun install
```

**Step 4:** Start the development server

```bash
bun run dev
```

The server will be running at [http://localhost:3030](http://localhost:3030)

---

## Deployment

### Docker Deployment

**Prerequisites:**
- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))

**Build the Docker image:**

```bash
docker build -t hianime-api .
```

**Run the container:**

```bash
docker run -p 3030:3030 hianime-api
```

**With environment variables:**

```bash
docker run -p 3030:3030 \
  -e NODE_ENV=production \
  -e PORT=3030 \
  hianime-api
```

**Using Docker Compose:**

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  hianime-api:
    build: .
    ports:
      - "3030:3030"
    environment:
      - NODE_ENV=production
      - PORT=3030
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3030/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Then run:

```bash
docker-compose up -d
```

### Vercel Deployment (Serverless) ![Recommended](https://img.shields.io/badge/Recommended-blue?style=flat-square)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ryanwtf7/hianime-api)

**Manual Deployment:**

1. Fork or clone the repository to your GitHub account
2. Sign up at [Vercel](https://vercel.com)
3. Create a new project and import your repository
4. Click "Deploy"

**Why Vercel?**
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Serverless architecture with automatic scaling
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Global CDN for fast response times
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Free tier with generous limits
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Automatic HTTPS and custom domains
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Git-based deployments (auto-deploy on push)


---

---

## Documentation

All endpoints return JSON responses. Base URL: `/api/v2`

### 1. GET Anime Home Page

Retrieve the home page data including spotlight anime, trending shows, top airing, and more.

**Endpoint:**
```
GET /api/v2/home
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/home');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "spotlight": [...],
    "trending": [...],
    "topAiring": [...],
    "mostPopular": [...],
    "mostFavorite": [...],
    "latestCompleted": [...],
    "latestEpisode": [...],
    "newAdded": [...],
    "topUpcoming": [...],
    "top10": {
      "today": [...],
      "week": [...],
      "month": [...]
    },
    "genres": [...]
  }
}
```

</details>

---

### 2. GET Next Episode Schedule

Get the next episode schedule for a specific anime.

**Endpoint:**
```
GET /api/v2/schedule/next/:id
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/schedule/next/one-piece-12');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "episode": 1181,
    "airingAt": "2027-01-03T14:16:00.000Z",
    "timeUntilAiring": 7703469
  }
}
```

</details>

---

### 4. GET Anime List Page

Retrieve anime lists based on various categories and filters.

**Endpoint:**
```
GET /api/v2/animes/:query/:category?page=:page
```

**Valid Queries:**

| Query | Has Category | Category Options |
|-------|--------------|------------------|
| `top-airing` | No | - |
| `most-popular` | No | - |
| `most-favorite` | No | - |
| `completed` | No | - |
| `recently-added` | No | - |
| `recently-updated` | No | - |
| `top-upcoming` | No | - |
| `genre` | Yes | action, adventure, cars, comedy, dementia, demons, drama, ecchi, fantasy, game, harem, historical, horror, isekai, josei, kids, magic, martial arts, mecha, military, music, mystery, parody, police, psychological, romance, samurai, school, sci-fi, seinen, shoujo, shoujo ai, shounen, shounen ai, slice of life, space, sports, super power, supernatural, thriller, vampire, yaoi, yuri |
| `producer` | Yes | Any producer slug (e.g., bones, toei-animation, mappa) |
| `az-list` | Yes | 0-9, all, a-z |
| `subbed-anime` | No | - |
| `dubbed-anime` | No | - |
| `movie` | No | - |
| `tv` | No | - |
| `ova` | No | - |
| `ona` | No | - |
| `special` | No | - |
| `events` | No | - |

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/az-list/a?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 10,
      "currentPage": 1,
      "hasNextPage": true
    },
    "response": [
      {
        "title": "Re:ZERO -Starting Life in Another World- Season 4",
        "alternativeTitle": "Re:ゼロから始める異世界生活 4th season",
        "id": "re-zero-starting-life-in-another-world-season-4-19509",
        "poster": "https://cdnanimo.xyz/poster/19509.jpg",
        "episodes": {
          "sub": 19,
          "dub": 17,
          "eps": 19
        },
        "type": "TV",
        "duration": "24m"
      }
    ]
  }
}
```

</details>

---

### 5. GET Anime Detailed Info

Retrieve comprehensive information about a specific anime.

**Endpoint:**
```
GET /api/v2/anime/:id
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/anime/one-piece-12');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "title": "One Piece",
    "alternativeTitle": "ONE PIECE",
    "japanese": "ONE PIECE",
    "id": "one-piece-12",
    "poster": "https://cdnanimo.xyz/poster/12.jpg",
    "rating": "PG-13",
    "type": "TV",
    "episodes": {
      "sub": 1180,
      "dub": 1155,
      "eps": 1180
    },
    "synopsis": "Gold Roger was known as the Pirate King ...",
    "synonyms": "ワンピース, OP, ...",
    "aired": {
      "from": "Oct 20, 1999",
      "to": null
    },
    "premiered": "FALL 1999",
    "duration": "24m",
    "status": "RELEASING",
    "MAL_score": "8.73",
    "genres": ["Action", "Adventure", "Drama", "Comedy", "Fantasy"],
    "studios": ["toei-animation", "fuji-tv", "tap"],
    "producers": [...],
    "moreSeasons": [],
    "related": [],
    "mostPopular": [],
    "recommended": [...]
  }
}
```

</details>

---

### 6. GET Search Results

Search for anime by keyword with pagination support.

**Endpoint:**
```
GET /api/v2/search?keyword=:query&page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/search?keyword=one+piece&page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 3,
      "currentPage": 1,
      "hasNextPage": true
    },
    "response": [
      {
        "title": "One Piece Fan Letter",
        "alternativeTitle": "ONE PIECE FAN LETTER",
        "id": "one-piece-fan-letter-18914",
        "poster": "https://cdnanimo.xyz/poster/18914.jpg",
        "episodes": {
          "sub": 1,
          "dub": null,
          "eps": 1
        },
        "type": "SPECIAL",
        "duration": "24m"
      }
    ]
  }
}
```

</details>

---

### 7. GET Search Suggestions

Get autocomplete suggestions while searching for anime.

**Endpoint:**
```
GET /api/v2/suggestion?keyword=:query
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/suggestion?keyword=naruto');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": [
    {
      "title": "Naruto Shippuden",
      "alternativeTitle": "Naruto: Shippuuden",
      "poster": "https://cdnanimo.xyz/poster/1493.jpg",
      "id": "naruto-shippuden-1493",
      "aired": "2007",
      "type": "TV",
      "duration": "23m"
    }
  ]
}
```

</details>

---

### 8. Filter Anime

Filter anime based on multiple criteria.

**Endpoint:**
```
GET /api/v2/filter?type=:type&status=:status&rated=:rated&score=:score&season=:season&language=:language&start_date=:start_date&end_date=:end_date&sort=:sort&genres=:genres&page=:page
```

**Query Parameters:**

- `type` - all, tv, movie, ova, ona, special, music
- `status` - all, finished_airing, currently_airing, not_yet_aired
- `rated` - all, g, pg, pg-13, r, r+, rx
- `score` - all, appalling, horrible, very_bad, bad, average, fine, good, very_good, great, masterpiece
- `season` - all, spring, summer, fall, winter
- `language` - all, sub, dub, sub_dub
- `start_date` - YYYY-MM-DD format
- `end_date` - YYYY-MM-DD format
- `sort` - default, recently-added, recently-updated, score, name-az, released-date, most-watched
- `genres` - Comma-separated genre slugs (action, adventure, cars, comedy, dementia, demons, mystery, drama, ecchi, fantasy, game, historical, horror, kids, magic, martial_arts, mecha, music, parody, samurai, romance, school, sci-fi, shoujo, shoujo_ai, shounen, shounen_ai, space, sports, super_power, vampire, harem, slice_of_life, supernatural, military, police, psychological, thriller, seinen, josei, isekai)
- `page` - Page number (default: 1)

**Request Example:**

```javascript
const resp = await fetch('/api/v2/filter?type=tv&status=currently_airing&sort=score&genres=action,fantasy&page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 20,
      "currentPage": 1,
      "hasNextPage": true
    },
    "response": [...]
  }
}
```

</details>

---

### 9. GET Filter Options

Get all available filter options.

**Endpoint:**
```
GET /api/v2/filter/options
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/filter/options');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "type": ["all", "movie", "tv", "ova", "ona", "special", "music"],
    "status": ["all", "finished_airing", "currently_airing", "not_yet_aired"],
    "rated": ["all", "g", "pg", "pg-13", "r", "r+", "rx"],
    "score": ["all", "appalling", "horrible", "very_bad", "bad", "average", "fine", "good", "very_good", "great", "masterpiece"],
    "season": ["all", "spring", "summer", "fall", "winter"],
    "language": ["all", "sub", "dub", "sub_dub"],
    "sort": ["default", "recently-added", "recently-updated", "score", "name-az", "released-date", "most-watched"],
    "genres": ["action", "adventure", "cars", "comedy", "dementia", "demons", "drama", "ecchi", "fantasy", "game", "harem", "historical", "horror", "isekai", "josei", "kids", "magic", "martial-arts", "mecha", "military", "music", "mystery", "parody", "police", "psychological", "romance", "samurai", "school", "sci-fi", "seinen", "shoujo", "shoujo-ai", "shounen", "shounen-ai", "slice-of-life", "space", "sports", "super-power", "supernatural", "thriller", "vampire", "yaoi", "yuri"]
  }
}
```

</details>

---

### 10. GET Anime Characters

Retrieve character list for a specific anime.

**Endpoint:**
```
GET /api/v2/characters/:id?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/characters/one-piece-12?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 3,
      "currentPage": 1,
      "hasNextPage": true
    },
    "response": [
      {
        "name": "Luffy Monkey",
        "id": "character:1480",
        "imageUrl": "https://cdnanimo.xyz/character/1480.jpg",
        "role": "MAIN",
        "voiceActors": [
          {
            "name": "Mayumi Tanaka",
            "id": "people:7111",
            "imageUrl": "https://cdnanimo.xyz/staff/7111.jpg",
            "cast": "Japanese"
          }
        ]
      }
    ]
  }
}
```

</details>

---

### 11. GET Character Details

Get detailed information about a character or voice actor.

**Endpoint:**
```
GET /api/v2/character/:id
```

**Request Example (Character):**

```javascript
const resp = await fetch('/api/v2/character/character:1480');
const data = await resp.json();
console.log(data);
```

**Request Example (Actor):**

```javascript
const resp = await fetch('/api/v2/character/people:7111');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "name": "Luffy Monkey",
    "type": "character",
    "japanese": "モンキー・D・ルフィ",
    "imageUrl": "https://cdnanimo.xyz/character/1480.jpg",
    "bio": "...",
    "animeAppearances": [
      {
        "title": "THE ONE PIECE",
        "alternativeTitle": null,
        "id": "the-one-piece-17836",
        "poster": "https://cdnanimo.xyz/poster/17836.jpg",
        "role": "MAIN",
        "type": "ONA"
      }
    ],
    "voiceActors": [
      {
        "name": "Mayumi Tanaka",
        "imageUrl": "https://cdnanimo.xyz/staff/7111.jpg",
        "id": "people:7111-mayumi-tanaka",
        "language": "Japanese"
      }
    ]
  }
}
```

</details>

---

### 12. GET Anime Episodes

Retrieve the episode list for a specific anime.

**Endpoint:**
```
GET /api/v2/episodes/:id
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/episodes/one-piece-12');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": [
    {
      "title": "I'm Luffy! The Man Who's Gonna Be King of the Pirates!",
      "alternativeTitle": "Ore wa Luffy! Kaizoku Ou ni Naru Otoko Da!",
      "episodeNumber": 1,
      "id": "1",
      "isFiller": false,
      "sub": true,
      "dub": true
    }
  ]
}
```

</details>

---

### 13. GET Episode Servers

Retrieve the available streaming servers for an episode, each with its direct player `iframe` embed URL. Use the episode `id` from [Anime Episodes](#12-get-anime-episodes).

**Endpoint:**

```
GET /api/v2/servers/:episodeId?type=:type
```

**Query Parameters:**

- `type` - `sub` (default) or `dub`
- `ani`, `mal` - optional IDs from the episodes endpoint, used for exact flixera/hd-2 embeds

**Request Example:**

```javascript
const resp = await fetch('/api/v2/servers/1?type=sub');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "episodeId": "1",
    "type": "sub",
    "servers": [
      {
        "serverName": "s-2",
        "serverId": "1-s2",
        "iframe": "https://cdn.4animo.xyz/embed/hd-1/1/sub?k=1&autoPlay=0&skipIntro=0&skipOutro=0"
      }
    ]
  }
}
```

</details>

---

### 14. GET Top Search

Retrieve the trending search terms shown on the landing page.

**Endpoint:**

```
GET /api/v2/top-search
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/top-search');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": [
    {
      "title": "One Piece",
      "link": "https://zangetsu.cc/search?keyword=One+Piece",
      "id": null
    },
    {
      "title": "Black Clover",
      "link": "https://zangetsu.cc/search?keyword=Black+Clover",
      "id": null
    }
  ]
}
```

</details>

---

### 17. GET Anime Schedules (7 Days)

Retrieve anime schedules for 7 days starting from the given date (or today).

**Endpoint:**
```
GET /api/v2/schedules
```

**Query Parameters:**

- `date` - Start date in YYYY-MM-DD format (optional, defaults to today)

**Request Example:**

```javascript
const resp = await fetch('/api/v2/schedules?date=2026-10-06');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "2026-10-06": [
      {
        "title": "Wushen Zhuzai: Da Wei Pian",
        "alternativeTitle": "Wushen Zhuzai: Da Wei Pian",
        "id": "wushen-zhuzai-da-wei-pian-16593",
        "time": "02:00 AM",
        "episode": 422
      }
    ]
  }
}
```

</details>

---

### 18. GET All Genres

Retrieve all available anime genres.

**Endpoint:**
```
GET /api/v2/genres
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/genres');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": [
    "action",
    "adventure",
    "cars",
    "comedy",
    "dementia",
    "demons",
    "drama",
    "ecchi",
    "fantasy",
    "game",
    "..."
  ]
}
```

</details>

---

### 19. GET Top Airing

Retrieve currently airing top anime.

**Endpoint:**
```
GET /api/v2/animes/top-airing?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/top-airing?page=1');
const data = await resp.json();
console.log(data);
```

---

### 20. GET Most Popular

Retrieve most popular anime.

**Endpoint:**
```
GET /api/v2/animes/most-popular?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/most-popular?page=1');
const data = await resp.json();
console.log(data);
```

---

### 21. GET Most Favorite

Retrieve most favorited anime.

**Endpoint:**
```
GET /api/v2/animes/most-favorite?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/most-favorite?page=1');
const data = await resp.json();
console.log(data);
```

---

### 22. GET Completed Anime

Retrieve completed anime series.

**Endpoint:**
```
GET /api/v2/animes/completed?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/completed?page=1');
const data = await resp.json();
console.log(data);
```

---

### 23. GET Recently Added

Retrieve recently added anime.

**Endpoint:**
```
GET /api/v2/animes/recently-added?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/recently-added?page=1');
const data = await resp.json();
console.log(data);
```

---

### 24. GET Recently Updated

Retrieve recently updated anime.

**Endpoint:**
```
GET /api/v2/animes/recently-updated?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/recently-updated?page=1');
const data = await resp.json();
console.log(data);
```

---

### 25. GET Top Upcoming

Retrieve top upcoming anime.

**Endpoint:**
```
GET /api/v2/animes/top-upcoming?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/top-upcoming?page=1');
const data = await resp.json();
console.log(data);
```

---

### 26. GET Anime by Genre

Retrieve anime filtered by specific genre.

**Endpoint:**
```
GET /api/v2/animes/genre/:genre?page=:page
```

**Available Genres:** action, adventure, cars, comedy, dementia, demons, drama, ecchi, fantasy, game, harem, historical, horror, isekai, josei, kids, magic, martial arts, mecha, military, music, mystery, parody, police, psychological, romance, samurai, school, sci-fi, seinen, shoujo, shoujo ai, shounen, shounen ai, slice of life, space, sports, super power, supernatural, thriller, vampire, yaoi, yuri

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/genre/action?page=1');
const data = await resp.json();
console.log(data);
```

---

### 27. GET Anime by Producer

Retrieve anime filtered by production studio or company.

**Endpoint:**
```
GET /api/v2/animes/producer/:producer?page=:page
```

**Producer Examples:** bones, toei-animation, mappa, ufotable, kyoto-animation, wit-studio, madhouse, a-1-pictures, trigger, cloverworks

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/producer/toei-animation?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 15,
      "currentPage": 1,
      "hasNextPage": true
    },
    "response": [
      {
        "title": "One Piece",
        "alternativeTitle": "ONE PIECE",
        "id": "one-piece-12",
        "poster": "https://cdnanimo.xyz/poster/12.jpg",
        "episodes": {
          "sub": 1180,
          "dub": 1155,
          "eps": 1180
        },
        "type": "TV",
        "duration": "24m"
      }
    ]
  }
}
```

</details>

---

### 28. GET Subbed Anime

Retrieve anime with subtitles available.

**Endpoint:**
```
GET /api/v2/animes/subbed-anime?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/subbed-anime?page=1');
const data = await resp.json();
console.log(data);
```

---

### 29. GET Dubbed Anime

Retrieve anime with English dub available.

**Endpoint:**
```
GET /api/v2/animes/dubbed-anime?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/dubbed-anime?page=1');
const data = await resp.json();
console.log(data);
```

---

### 30. GET Anime Movies

Retrieve anime movies.

**Endpoint:**
```
GET /api/v2/animes/movie?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/movie?page=1');
const data = await resp.json();
console.log(data);
```

---

### 31. GET TV Series

Retrieve anime TV series.

**Endpoint:**
```
GET /api/v2/animes/tv?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/tv?page=1');
const data = await resp.json();
console.log(data);
```

---

### 32. GET OVA

Retrieve Original Video Animation (OVA) content.

**Endpoint:**
```
GET /api/v2/animes/ova?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/ova?page=1');
const data = await resp.json();
console.log(data);
```

---

### 33. GET ONA

Retrieve Original Net Animation (ONA) content.

**Endpoint:**
```
GET /api/v2/animes/ona?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/ona?page=1');
const data = await resp.json();
console.log(data);
```

---

### 34. GET Special

Retrieve special anime episodes.

**Endpoint:**
```
GET /api/v2/animes/special?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/special?page=1');
const data = await resp.json();
console.log(data);
```

---

### 35. GET Events

Retrieve anime events.

**Endpoint:**
```
GET /api/v2/animes/events?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/animes/events?page=1');
const data = await resp.json();
console.log(data);
```

---

---

## Development

Pull requests and stars are always welcome. If you encounter any bug or want to add a new feature to this API, consider creating a new [issue](https://github.com/ryanwtf7/hianime-api/issues). If you wish to contribute to this project, feel free to make a pull request.

### Running in Development Mode

```bash
bun run dev
```

### Running in Production Mode

```bash
bun start
```

---

### 37. GET Anime News

Retrieve latest anime news articles.

**Endpoint:**
```
GET /api/v2/news?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/news?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "the-fledgling-demon-lord-starter-shop-anime-2nd-teaser-reveals-more-cast-january-242541",
        "title": "The Fledgling Demon Lord's Starter Shop Anime's 2nd Teaser Reveals More Cast, January Debut",
        "description": "Yōhei Azakami joins cast as hero Ash ― ...",
        "thumbnail": "https://www.animenewsnetwork.com/thumbnails/...",
        "uploadedAt": "...",
        "url": "/news/2026-10-06/the-fledgling-demon-lord-starter-shop-anime-2nd-teaser-reveals-more-cast-january-242541"
      }
    ],
    "total": 24
  }
}
```

</details>

---

---

### 39. GET Random Anime

Retrieve a random anime ID.

**Endpoint:**
```
GET /api/v2/random
```

**Request Example:**

```javascript
const resp = await fetch('/api/v2/random');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

<details>
<summary>Example</summary>

```javascript
{
  "success": true,
  "data": {
    "id": "mashle-sanma-taisou-shinkakusha-saishuu-shiken-hen-18308"
  }
}
```

</details>

---

## Contributors

Thanks to the following people for keeping this project alive and relevant:

<a href="https://github.com/ryanwtf7/hianime-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ryanwtf7/hianime-api" alt="Contributors" />
</a>

Want to contribute? Check out our [contribution guidelines](https://github.com/ryanwtf7/hianime-api/blob/main/CONTRIBUTING.md) and feel free to submit a pull request!

---

## Acknowledgments

Special thanks to the following projects for inspiration and reference:

- [consumet.ts](https://github.com/consumet/consumet.ts)
- [api.consumet.org](https://github.com/consumet/api.consumet.org)

---

## Support

If you find this project useful, please consider giving it a star on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/ryanwtf7/hianime-api?style=social)](https://github.com/ryanwtf7/hianime-api/stargazers)

---

<div align="center">

**Made by RY4N**

[Report Bug](https://github.com/ryanwtf7/hianime-api/issues) • [Request Feature](https://github.com/ryanwtf7/hianime-api/issues)

</div>
