import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Box, Spinner, Icon } from '@chakra-ui/react';
import { BsArrowLeft } from 'react-icons/bs';
import useToastAPI from '../../hooks/useToastAPI';

import axios from '../../API/API';
import { Item } from '../../Interface/Interface';
import { useAuthContext } from '../../context/AuthContext';

import ItemContent from './parts/ItemContent';
import MetaHead from '../../components/MetaHead/MetaHead';
import useFetch from '../../hooks/useFetch';

interface RouteProps {
	slug: string;
}

interface Props extends RouteComponentProps<RouteProps> {}

const ItemPage: FC<Props> = ({ match, history }) => {
	const { user } = useAuthContext();

	// const [isLoading, setIsLoading] = useState(false);

	// const [data, setData] = useState<null | Item>(null);

	const [data, isLoading] = useFetch<{ item: Item }>({
		url: `/store/${match.params.slug}`,
	});

	const toast = useToastAPI();

	// useEffect(() => {
	// 	setIsLoading(true);
	// 	function GET_ITEM() {
	// 		axios({
	// 			url: `/store/${match.params.slug}`,
	// 		}).then(res => {
	// 			setData(res.data.data.item);

	// 			setIsLoading(false);
	// 		});
	// 	}

	// 	GET_ITEM();
	// }, [match.params.slug]);

	const [deletingItem, setDeletingItem] = useState(false);

	const handleDeleteItemAction = () => {
		setDeletingItem(true);

		axios({
			url: `/store/${data?.item?.slug}`,
			method: 'DELETE',
		})
			.then(() => {
				toast({
					title: 'Item Deleted Successfully',
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
			})
			.catch(() => {
				toast({
					title: 'Something went wrong',
					description: 'Try Again Later',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			})
			.finally(() => {
				setDeletingItem(false);
				history.push('/');
			});
	};

	if (isLoading) {
		return (
			<Box
				pos='absolute'
				w='100%'
				h='100%'
				d='flex'
				justifyContent='center'
				alignItems='center'>
				<Spinner size='xl' />
			</Box>
		);
	}

	return (
		<Box w='100%' h='100%'>
			<MetaHead title={`ACME | ${match.params.slug}`} />
			<Icon
				as={BsArrowLeft}
				mt='2rem'
				ml='4rem'
				fontSize='2rem'
				cursor='pointer'
				onClick={() => history.goBack()}
			/>
			<Box my={['2rem', '4rem']} d='flex' justifyContent='center'>
				<ItemContent
					role={user?.role}
					handleDeleteItemAction={handleDeleteItemAction}
					deletingItem={deletingItem}
					{...data?.item}
				/>
			</Box>
		</Box>
	);
};

export default ItemPage;
