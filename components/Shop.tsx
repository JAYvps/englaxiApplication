import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Check, ShoppingBag, Zap, Heart, FlaskConical } from 'lucide-react';
import { SkinId } from '../types';
import Character from './Character';

interface Props {
  gems: number;
  ownedSkins: SkinId[];
  equippedSkin: SkinId;
  onClose: () => void;
  onBuy: (skin: SkinId, price: number) => void;
  onBuyItem: (id: string, price: number) => void;
  onEquip: (skin: SkinId) => void;
}

const SKINS: { id: SkinId; name: string; price: number; desc: string }[] = [
  { id: 'default', name: '原厂萌物', price: 0, desc: '最初的伙伴' },
  { id: 'ice', name: '冰霜Momo', price: 500, desc: '来自极寒之地' },
  { id: 'fire', name: '烈焰Momo', price: 1000, desc: '热情似火' },
  { id: 'ninja', name: '忍·Momo', price: 2000, desc: '潜行于阴影' },
  { id: 'gold', name: '至尊土豪', price: 5000, desc: '闪瞎你的眼' },
];

const ITEMS = [
    { id: 'potion', name: '生命恢复药水', price: 100, desc: '战斗失败时复活+1HP', icon: <FlaskConical size={24} className="text-pink-500" /> }
];

const Shop: React.FC<Props> = ({ gems, ownedSkins, equippedSkin, onClose, onBuy, onBuyItem, onEquip }) => {
  const [tab, setTab] = useState<'skins' | 'items'>('skins');

  return (
    <div className="h-full bg-gradient-to-b from-indigo-50 to-indigo-100 flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur z-20 shadow-sm">
        <button onClick={onClose} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-pink-500" /> 商店
        </h2>
        <div className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-1 border border-indigo-200">
          <div className="w-4 h-4 bg-blue-400 rounded-full" />
          <span className="text-indigo-700 font-bold text-sm">{gems}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 pt-4 gap-4 z-10">
          <button 
            onClick={() => setTab('skins')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === 'skins' ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'bg-white text-slate-500'}`}
          >
              角色皮肤
          </button>
          <button 
            onClick={() => setTab('items')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === 'items' ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'bg-white text-slate-500'}`}
          >
              道具补给
          </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-20 z-10">
        <div className="grid grid-cols-1 gap-4">
          
          {tab === 'skins' && SKINS.map((skin) => {
            const isOwned = ownedSkins.includes(skin.id);
            const isEquipped = equippedSkin === skin.id;
            const canAfford = gems >= skin.price;

            return (
              <motion.div 
                key={skin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl p-4 flex items-center gap-4 border-2 shadow-sm ${isEquipped ? 'border-pink-500 ring-2 ring-pink-100' : 'border-white'}`}
              >
                {/* Preview */}
                <div className="bg-slate-50 rounded-2xl w-24 h-24 flex items-center justify-center shrink-0">
                  <div className="scale-[0.6]">
                    <Character skin={skin.id} emotion="happy" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{skin.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">{skin.desc}</p>
                  
                  {isOwned ? (
                    <button 
                      onClick={() => onEquip(skin.id)}
                      disabled={isEquipped}
                      className={`px-4 py-2 rounded-xl text-xs font-bold w-full transition-all ${
                        isEquipped 
                          ? 'bg-green-100 text-green-600 cursor-default' 
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      {isEquipped ? <span className="flex items-center justify-center gap-1"><Check size={12}/> 已装备</span> : '装备'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => onBuy(skin.id, skin.price)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-xs font-bold w-full flex items-center justify-center gap-1 transition-all ${
                        canAfford 
                          ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-md shadow-pink-200' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? '购买' : '宝石不足'} 
                      <span className="font-normal opacity-80">| {skin.price}</span>
                      <div className="w-2 h-2 bg-blue-200 rounded-full inline-block" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {tab === 'items' && ITEMS.map((item) => {
            const canAfford = gems >= item.price;
            return (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-4 flex items-center gap-4 border-2 border-white shadow-sm"
                >
                    <div className="bg-pink-50 rounded-2xl w-20 h-20 flex items-center justify-center shrink-0 border border-pink-100">
                        {item.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                        <button 
                            onClick={() => onBuyItem(item.id, item.price)}
                            disabled={!canAfford}
                            className={`px-4 py-2 rounded-xl text-xs font-bold w-full flex items-center justify-center gap-1 transition-all ${
                                canAfford 
                                ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-md shadow-pink-200' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {canAfford ? '购买' : '宝石不足'}
                            <span className="font-normal opacity-80">| {item.price}</span>
                            <div className="w-2 h-2 bg-blue-200 rounded-full inline-block" />
                        </button>
                    </div>
                </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Shop;