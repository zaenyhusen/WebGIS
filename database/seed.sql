INSERT INTO categories (name, slug, color) VALUES
('Urban Growth', 'urban-growth', '#00E5FF'),
('Land Use', 'land-use', '#00FF88'),
('Climate', 'climate', '#FF6B35'),
('Terrain Analysis', 'terrain-analysis', '#A855F7'),
('Disaster Risk', 'disaster-risk', '#FF3B3B');

INSERT INTO analysis_points 
(title, description, category_id, tools, external_link, confidence_score, location)
VALUES
(
    'Jabodetabek Expansion 2024',
    'Deep spatial analysis of urban sprawl trends within the Greater Jakarta area. This study utilizes multi-temporal satellite imagery to detect changes in impervious surfaces and vegetation cover over a 24-month period.',
    (SELECT id FROM categories WHERE slug = 'urban-growth'),
    ARRAY['Sentinel-2', 'GDAL', 'Python/SciPy'],
    'https://medium.com',
    94,
    ST_SetSRID(ST_MakePoint(106.8456, -6.2088), 4326)
),
(
    'Deforestasi Kalimantan 2023',
    'Analisis perubahan tutupan hutan di Kalimantan Tengah menggunakan citra Landsat-8 dan teknik klasifikasi supervised untuk mendeteksi area deforestasi selama periode 2020-2023.',
    (SELECT id FROM categories WHERE slug = 'land-use'),
    ARRAY['Landsat-8', 'QGIS', 'Google Earth Engine'],
    'https://medium.com',
    87,
    ST_SetSRID(ST_MakePoint(113.9213, -1.6815), 4326)
),
(
    'Pola Curah Hujan Sumatera',
    'Pemodelan distribusi curah hujan tahunan di Pulau Sumatera menggunakan data CHIRPS dan interpolasi spasial untuk mendukung perencanaan pertanian.',
    (SELECT id FROM categories WHERE slug = 'climate'),
    ARRAY['Python', 'CHIRPS', 'GeoPandas'],
    'https://medium.com',
    91,
    ST_SetSRID(ST_MakePoint(104.9457, -2.9761), 4326)
),
(
    'Morfologi Gunung Merapi',
    'Analisis perubahan morfologi puncak Gunung Merapi menggunakan DEM multi-temporal dari data SRTM dan TanDEM-X untuk memantau aktivitas vulkanik.',
    (SELECT id FROM categories WHERE slug = 'terrain-analysis'),
    ARRAY['SRTM', 'ArcGIS', 'Python'],
    'https://medium.com',
    89,
    ST_SetSRID(ST_MakePoint(110.4457, -7.5407), 4326)
),
(
    'Risiko Banjir Bandung Raya',
    'Pemetaan zona risiko banjir di kawasan Bandung Raya menggunakan analisis DEM, data curah hujan historis, dan model hidrologi untuk mitigasi bencana.',
    (SELECT id FROM categories WHERE slug = 'disaster-risk'),
    ARRAY['HEC-RAS', 'QGIS', 'Sentinel-1'],
    'https://medium.com',
    85,
    ST_SetSRID(ST_MakePoint(107.6098, -6.9175), 4326)
),
(
    'Urban Heat Island Surabaya',
    'Pemetaan fenomena urban heat island di Kota Surabaya menggunakan data thermal Landsat dan analisis NDVI untuk mengidentifikasi area prioritas penghijauan.',
    (SELECT id FROM categories WHERE slug = 'urban-growth'),
    ARRAY['Landsat-8', 'Python', 'QGIS'],
    'https://medium.com',
    92,
    ST_SetSRID(ST_MakePoint(112.7508, -7.2575), 4326)
);

SELECT 
    ap.title,
    c.name AS category,
    ap.confidence_score,
    ST_AsText(ap.location) AS koordinat
FROM analysis_points ap
JOIN categories c ON ap.category_id = c.id
ORDER BY ap.created_at;