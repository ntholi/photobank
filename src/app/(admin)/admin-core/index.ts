import ResourcePage from './ResourcePage';
import DetailsView from './DetailsView';
import EditView, { EditViewProps } from './EditView';
import CreateView, { CreateViewProps } from './CreateView';
import FieldView from './field-views/FieldView';
import ReferenceView from './field-views/ReferenceView';
import ImagePicker from './form/ImagePicker';
import TextField from './form/TextField';
import ReferenceField from './form/ReferenceField';
import SelectField from './form/SelectField';
import { FirebaseRepository } from './repository/firebase-repository';

export {
  ResourcePage,
  DetailsView,
  EditView,
  CreateView,
  ImagePicker,
  FieldView,
  TextField,
  ReferenceField,
  SelectField,
  ReferenceView,
  FirebaseRepository,
};

export type { EditViewProps, CreateViewProps };
