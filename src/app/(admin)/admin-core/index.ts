import ResourcePage from './ResourcePage';
import DetailsView from './DetailsView';
import EditView, { EditViewProps } from './EditView';
import CreateView, { CreateViewProps } from './CreateView';
import FieldView from './field-views/FieldView';
import ReferenceView from './field-views/ReferenceView';
import ImagePicker from './form/ImagePicker';
import ReferenceField from './form/ReferenceField';
import { FirebaseRepository } from './repository/firebase-repository';

export {
  ResourcePage,
  DetailsView,
  EditView,
  CreateView,
  ImagePicker,
  FieldView,
  ReferenceField,
  ReferenceView,
  FirebaseRepository,
};

export type { EditViewProps, CreateViewProps };
