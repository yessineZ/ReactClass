import React, { useEffect } from 'react'
import CategoryItem from './CategoryItem';
import { useCartStore } from '../../store/useCartStore';
const categories = [
	{ href : '/Mode Homme',name : 'Mode Homme',imageUrl : 'http://res.cloudinary.com/iset-sfax/image/upload/v1658747406/images/Mode-HommeJ.jpg.jpg'},
	{ href: "/Mode Femme", name: "Mode Femme", imageUrl: "" },
	{ href: "/Mode Enfant", name: "Mode Enfant", imageUrl: "" },
	{ href: "/Mode Bébé", name: "Mode Bébé", imageUrl: "/" },
	{ href: "/Montres", name: "Montres", imageUrl: "" },
	{ href: "/Bagagerie", name: "Bagagerie", imageUrl: "" },
	{ href: "/Running", name: "Running", imageUrl: "http://res.cloudinary.com/iset-sfax/image/upload/v1658747406/images/Mode-HommeJ.jpg.jpg" },
	{ href: "/Sport de raquette", name: "Sport de raquette", imageUrl: "" },
	{ href: "/Sport & Fitness", name: "Sport & Fitness", imageUrl: "http://res.cloudinary.com/iset-sfax/image/upload/v1658749261/images/Sante-beaute.jpg.jpg" },
];

const HomeCategories = () => {
	const {getCartItems} = useCartStore() ; 
	useEffect(() => {
		getCartItems() ; 
	},[getCartItems]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>
				


			</div>

		</div>
	);
};
export default HomeCategories;