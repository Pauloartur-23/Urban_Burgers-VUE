import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menu = [
    {
      name: 'BURGERS',
      link: '#burgers',
      id: 1,
      itens: [
        {
          name: 'URBAN CLASSIC',
          link: '#urban-classic',
          img: 'urban_classic.png',
          desc: 'Pão brioche, blend 180g, cheddar, alface e tomate.',
          preco: 28.9,
          id: 1,
        },
        {
          name: 'URBAN BACON',
          link: '#urban-bacon',
          img: 'urban_bacon.png',
          desc: 'Pão brioche, blend 180g, cheddar, bacon crocante e molho especial.',
          preco: 32.9,
          id: 2,
        },
        {
          name: 'URBAN ONION',
          link: '#urban-onion',
          img: 'urban_onion.png',
          desc: 'Pão brioche, blend 180g, cheddar, onion rings e molho barbecue.',
          preco: 31.9,
          id: 3,
        },
        {
          name: 'URBAN CHICKEN',
          link: '#urban-chicken',
          img: 'urban_chicken.png',
          desc: 'Pão brioche, frango crocante, cheddar, alface, tomate e molho especial.',
          preco: 30.9,
          id: 4,
        },
      ],
    },

    {
      name: 'COMBOS',
      link: '#combos',
      id: 2,
      itens: [
        {
          name: 'URBAN COMBO',
          link: '#urban-combo',
          img: 'combo_urban_classic.png',
          desc: 'Hambúrguer clássico, batata frita e refrigerante.',
          preco: 39.9,
          id: 1,
        },
        {
          name: 'URBAN ONION COMBO',
          link: '#urban-onion-combo',
          img: 'combo_urban_onion.png',
          desc: 'Onion burger, batata frita e refrigerante.',
          preco: 43.9,
          id: 2,
        },
        {
          name: 'URBAN BACON BURGER COMBO',
          link: '#urban-bacon-burger-combo',
          img: 'combo_urban_bacon.png',
          desc: 'Hambúrguer com bacon, batata frita e refrigerante.',
          preco: 47.9,
          id: 3,
        },
        {
          name: 'URBAN CHICKEN BURGER COMBO',
          link: '#urban-chicken-burger-combo',
          img: 'combo_urban_chicken.png',
          desc: 'Chicken burger, batata frita e refrigerante.',
          preco: 45.9,
          id: 4,
        },
      ],
    },

    {
      name: 'PORÇÕES',
      link: '#porcoes',
      id: 3,
      itens: [
        {
          name: 'URBAN FRIES',
          link: '#urban-fries',
          img: 'porcao_batata_frita.png',
          desc: 'Porção de batatas fritas crocantes, douradas e temperadas.',
          preco: 18.9,
          id: 1,
        },
        {
          name: 'URBAN CALABRESA',
          link: '#urban-calabresa',
          img: 'porcao_batata_calabresa.png',
          desc: 'Batatas fritas crocantes com calabresa dourada e temperada.',
          preco: 24.9,
          id: 2,
        },
        {
          name: 'URBAN ONION RINGS',
          link: '#urban-onion-rings',
          img: 'porcao_onion.png',
          desc: 'Onion rings crocantes e douradas, perfeitas para compartilhar.',
          preco: 22.9,
          id: 3,
        },
        {
          name: 'URBAN BACON FRIES',
          link: '#urban-bacon-fries',
          img: 'porcao_batata_bacon.png',
          desc: 'Batatas fritas crocantes cobertas com cheddar cremoso e bacon crocante.',
          preco: 26.9,
          id: 4,
        },
      ],
    },

    {
      name: 'BEBIDAS',
      link: '#bebidas',
      id: 4,
      itens: [
        {
          name: 'URBAN COLA',
          link: '#urban-cola',
          img: 'urban_refrigerante.png',
          desc: 'Refrigerante gelado e refrescante.',
          preco: 7.9,
          id: 1,
        },
        {
          name: 'URBAN BEER',
          link: '#urban-beer',
          img: 'urban_cerveja.png',
          desc: 'Cerveja gelada para acompanhar seu burger.',
          preco: 9.9,
          id: 2,
        },
        {
          name: 'URBAN JUICE',
          link: '#urban-juice',
          img: 'urban_suco.png',
          desc: 'Suco natural, gelado e cheio de sabor.',
          preco: 9.9,
          id: 3,
        },
        {
          name: 'URBAN WATER',
          link: '#urban-water',
          img: 'urban_agua.png',
          desc: 'Água mineral gelada.',
          preco: 5.0,
          id: 4,
        },
      ],
    },
  ]

  return { menu }
})
