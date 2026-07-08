import { motion } from 'framer-motion';
import { MapPin, Phone, Tractor } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../services/api';

const ListingCard = ({ listing }) => {
  const image = listing.images?.[0] ? `${IMAGE_BASE_URL}${listing.images[0]}` : null;

  return (
    <motion.div whileHover={{ y: -4 }} className="card overflow-hidden">
      <div className="h-44 bg-primary-50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={listing.equipmentName} className="w-full h-full object-cover" />
        ) : (
          <Tractor className="w-14 h-14 text-primary-300" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800">{listing.equipmentName}</h3>
          <span
            className={`badge whitespace-nowrap ${
              listing.availabilityStatus === 'Available' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {listing.availabilityStatus}
          </span>
        </div>
        <p className="text-primary-700 font-bold">
          ₹{listing.rentalPrice}
          <span className="text-sm font-normal text-gray-500"> / {listing.priceUnit}</span>
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {listing.village}, {listing.district}, {listing.state}
        </p>
        <p className="text-sm text-gray-600">Owner: {listing.owner?.name || '—'}</p>

        <div className="flex gap-2 pt-2">
          <a href={`tel:${listing.contactNumber}`} className="btn-secondary flex-1 !py-2 text-sm">
            <Phone className="w-4 h-4" /> Call
          </a>
          {listing.whatsappNumber && (
            <a
              href={`https://wa.me/${listing.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex-1 !py-2 text-sm !bg-green-600 hover:!bg-green-700"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
