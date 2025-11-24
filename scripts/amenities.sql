INSERT INTO space_amenities (space_id, amenity) VALUES 
(100, 'Projetor 4K'), (100, 'Whiteboard'), (100, 'WiFi'), (100, 'Ar condicionado'), (100, 'Água e café'),
(101, 'Som profissional'), (101, 'Palco com iluminação'), (101, 'Ar condicionado'), (101, 'Assentos confortáveis'), (101, 'WiFi'),
(102, 'WiFi fibra'), (102, 'Café grátis'), (102, 'Tomadas múltiplas'), (102, 'Comunidade'),
(103, 'Computadores'), (103, 'Projetor'), (103, 'Lousa digital'), (103, 'WiFi'), (103, 'Cadeiras ergonômicas'),
(104, 'Microfones premium'), (104, 'Console de som'), (104, 'Isolamento acústico'), (104, 'Câmera para streaming'),
(105, 'Catering'), (105, 'Iluminação ambiente'), (105, 'Som e projeção'), (105, 'WiFi'),
(106, 'Silencioso'), (106, 'WiFi'), (106, 'Ergonômico');
SELECT setval('users_id_seq', 4);
SELECT setval('spaces_id_seq', 107);
SELECT setval('reservations_id_seq', 1005);
