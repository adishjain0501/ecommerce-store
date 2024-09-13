import { createAction, props } from "@ngrx/store";
import { Category } from "../../models/category.model";

export const setCategoryData = createAction(
    "SET_CATEGORIES_DATA",
    props<{categories:Category[]}>()
);