import { Category } from './Category_model';
import { User } from '../user/user.model';
import slugify from 'slugify';

function subCategory(categories, parentId = null) {
	const categoryList = [];
	let category;
	if (parentId == null) {
		category = categories.filter(cat => cat.parentId == undefined);
	} else {
		category = categories.filter(cat => cat.parentId == parentId);
	}
	for (let cate of category) {
		categoryList.push({
			_id: cate._id,
			category: cate.category,
			slug: cate.slug,
			image: cate.image,
			status: cate.status,
			featured: cate.featured,
			subCategory: subCategory(categories, cate._id)
		});
	}

	return categoryList;
}
const add_category = async (req, res) => {
	const { category, parentId } = req.body;
	console.log(req.body, req.file);
	let categoryObj;
	try {
		if (req.file) {
			categoryObj = {
				category,
				image: req.file.location,
				slug: slugify(category)
			};
		} else {
			categoryObj = {
				category,
				slug: slugify(category)
			};
		}
		if (parentId) {
			categoryObj.parentId = parentId;
		}

		const newCategory = await Category.create(categoryObj);

		const updateUser = await User.findByIdAndUpdate(
			req.user._id,
			{
				$addToSet: {
					categories: newCategory._id
				}
			},
			{ new: true }
		);

		res.status(201).json(updateUser);
	} catch (error) {
		res.json(error);
	}
};

const view_category = async (req, res) => {
	try {
		const id = req.params.id;
		const check = await Category.findById(id).populate('parentId');
		if (!check) {
			res.json('no category found!!');
		}
		res.json(check);
	} catch (e) {
		res.json(e.message);
	}
};

const view = async (req, res) => {
	try {
		const category = await Category.find({ status: true });
		const categoryList = subCategory(category);
		res.json(categoryList);
	} catch (e) {
		res.json(e.message);
	}
};

const update_category = async (req, res) => {
	try {
		const { status, category, parentId, featured } = req.body;
		const id = req.params.id;
		const check = await Category.findById(id);

		if (!check) {
			res.json('no category found!!');
		}
		if (status !== undefined) {
			const update = await Category.findByIdAndUpdate(
				id,

				{
					$set: {
						status
					}
				},
				{
					new: true
				}
			);

			return res.json(update);
		} else if (featured !== undefined) {
			const update = await Category.findByIdAndUpdate(
				id,

				{
					$set: {
						featured
					}
				},
				{
					new: true
				}
			);

			return res.json(update);
		} else if (req.file) {
			const update = await Category.findByIdAndUpdate(
				id,
				{ image: req.file.location, category },
				{
					new: true
				}
			);
			res.json(update);
		} else {
			const update = await Category.findByIdAndUpdate(
				id,
				{ category, parentId },
				{
					new: true
				}
			);
			res.json(update);
		}
	} catch (e) {
		res.json(e.message);
	}
};

const delete_category = async (req, res) => {
	try {
		const id = req.params.id;
		const check = await Category.findById(id);
		if (!check) {
			res.json('no category found!!');
		}
		const subCategory = await Category.find({ parentId: id });
		if (subCategory.length > 0) {
			let subCate_id = subCategory[0]._id;
			let deleteSubcate = await Category.findByIdAndDelete({ _id: subCate_id });
			const deletee = await Category.findByIdAndDelete(id);
			const user = await User.findByIdAndUpdate(req.user._id, {
				$pull: {
					categories: id
				}
			});
			if (deletee && deleteSubcate) {
				return res.json(deletee);
			}
		} else {
			const deletee = await Category.findByIdAndDelete(id);
			const user = await User.findByIdAndUpdate(req.user._id, {
				$pull: {
					categories: id
				}
			});

			if (deletee) {
				res.json(deletee);
			}
		}
	} catch (e) {
		res.json(e.message);
	}
};

const deleteAll = async (req, res) => {
	const deleteCat = await User.updateMany(
		{},
		{
			$set: {
				categories: []
			}
		},
		{ multi: true }
	);

	if (deleteCat) {
		return res.status(204).json({
			message: 'Deleted All categories'
		});
	}
};

export {
	add_category,
	view_category,
	view,
	update_category,
	delete_category,
	deleteAll
};
