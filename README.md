# hianime-api

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/bun-%23000000.svg?style=flat&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**A RESTful API that utilizes web scraping to fetch anime content from hianime.to**

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

hianime-api is a comprehensive RESTful API that provides endpoints to retrieve anime details, episodes, and streaming links by scraping content from hianime.to. Built with modern web technologies, it offers a robust solution for anime content aggregation.

## Important Notice

> ![Disclaimer](https://img.shields.io/badge/Disclaimer-red?style=for-the-badge&logo=alert&logoColor=white)

1. This API is recommended for **personal use only**. Deploy your own instance and customize it as needed.

2. This API is just an **unofficial API for [hianime.to](https://hianime.to)** and is in no other way officially related to the same.

3. The content that this API provides is not mine, nor is it hosted by me. These belong to their respective owners. This API just demonstrates how to build an API that scrapes websites and uses their content.

---

## Video Integration

For video playback, it is recommended to use the following external player. You can embed it using an `iframe` with the dynamic parameters retrieved from this API.

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
const resp = await fetch('/api/v2/schedule/next/one-piece-100');
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
    "nextEpisode": {
      "episodeNumber": 1120,
      "releaseDate": "2024-12-15"
    }
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
| `genre` | Yes | action, adventure, cars, comedy, dementia, demons, drama, ecchi, fantasy, game, harem, historical, horror, isekai, josei, kids, magic, martial arts, mecha, military, music, mystery, parody, police, psychological, romance, samurai, school, sci-fi, seinen, shoujo, shoujo ai, shounen, shounen ai, slice of life, space, sports, super power, supernatural, thriller, vampire |
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
    "animes": [
      {
        "title": "Attack on Titan",
        "alternativeTitle": "Shingeki no Kyojin",
        "id": "attack-on-titan-112",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episodes": {
          "sub": 25,
          "dub": 25,
          "eps": 25
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
const resp = await fetch('/api/v2/anime/attack-on-titan-112');
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
    "title": "Attack on Titan",
    "alternativeTitle": "Shingeki no Kyojin",
    "japanese": "進撃の巨人",
    "id": "attack-on-titan-112",
    "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
    "rating": "R",
    "type": "TV",
    "episodes": {
      "sub": 25,
      "dub": 25,
      "eps": 25
    },
    "synopsis": "...",
    "synonyms": "AoT",
    "aired": {
      "from": "Apr 7, 2013",
      "to": "Sep 29, 2013"
    },
    "premiered": "Spring 2013",
    "duration": "24m",
    "status": "Finished Airing",
    "MAL_score": "8.52",
    "genres": [...],
    "studios": ["wit-studio"],
    "producers": [...],
    "moreSeasons": [...],
    "related": [...],
    "mostPopular": [...],
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
      "totalPages": 5,
      "currentPage": 1,
      "hasNextPage": true
    },
    "animes": [
      {
        "title": "One Piece",
        "alternativeTitle": "One Piece",
        "id": "one-piece-100",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episodes": {
          "sub": 1100,
          "dub": 1050,
          "eps": 1100
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
      "title": "Naruto",
      "alternativeTitle": "Naruto",
      "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
      "id": "naruto-677",
      "aired": "Oct 3, 2002",
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
    "animes": [...]
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
    "types": [...],
    "statuses": [...],
    "ratings": [...],
    "scores": [...],
    "seasons": [...],
    "languages": [...],
    "sorts": [...],
    "genres": [...]
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
const resp = await fetch('/api/v2/characters/one-piece-100?page=1');
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
      "totalPages": 5,
      "currentPage": 1,
      "hasNextPage": true
    },
    "characters": [
      {
        "name": "Monkey D. Luffy",
        "image": "https://...",
        "id": "character:monkey-d-luffy-1",
        "role": "Main",
        "voiceActors": [...]
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
const resp = await fetch('/api/v2/character/character:roronoa-zoro-7');
const data = await resp.json();
console.log(data);
```

**Request Example (Actor):**

```javascript
const resp = await fetch('/api/v2/character/people:kana-hanazawa-1');
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
    "name": "Roronoa Zoro",
    "image": "https://...",
    "role": "Main",
    "animeAppearances": [...],
    "biography": "...",
    "voiceActors": [...]
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
const resp = await fetch('/api/v2/episodes/steins-gate-3');
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
    "totalEpisodes": 24,
    "episodes": [
      {
        "title": "Turning Point",
        "alternativeTitle": "Hajimari to Owari no Prologue",
        "episodeNumber": 1,
        "id": "steinsgate-3?ep=213",
        "isFiller": false
      }
    ]
  }
}
```

</details>

---

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
const resp = await fetch('/api/v2/schedules?date=2024-01-01');
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
    "2024-01-01": [
      {
        "id": "anime-id",
        "time": "10:30",
        "title": "Anime Title",
        "jname": "Japanese Title",
        "episode": 12
      }
    ],
    "2024-01-02": [ ... ]
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
    {
      "name": "Action",
      "slug": "action"
    },
    {
      "name": "Adventure",
      "slug": "adventure"
    }
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

**Available Genres:** action, adventure, cars, comedy, dementia, demons, drama, ecchi, fantasy, game, harem, historical, horror, isekai, josei, kids, magic, martial arts, mecha, military, music, mystery, parody, police, psychological, romance, samurai, school, sci-fi, seinen, shoujo, shoujo ai, shounen, shounen ai, slice of life, space, sports, super power, supernatural, thriller, vampire

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
const resp = await fetch('/api/v2/animes/producer/bones?page=1');
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
    "animes": [
      {
        "title": "My Hero Academia",
        "alternativeTitle": "Boku no Hero Academia",
        "id": "my-hero-academia-67",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episodes": {
          "sub": 13,
          "dub": 13,
          "eps": 13
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
        "id": "article-id",
        "title": "Article Title",
        "description": "...",
        "thumbnail": "https://...",
        "uploadedAt": "2 hours ago"
      }
    ]
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
    "id": "anime-id-123"
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
